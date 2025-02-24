const { PrismaClient } = require('@prisma/client');
const getTopTenScoringPlayers = require('../utils/weeklyTopScoringPlayers');
const leagueQueries = require('./leagueQueries');

const prisma = new PrismaClient();

/**
 * Get roster data for every team in the league
 * @returns {Promise<JSON[]>} Array of JSON Objects which contain roster data for each team
 */

exports.getRosters = async function () {
  const leagueRosters = [];
  try {
    const { teamKeys } = await leagueQueries.getLeagueMetadata();
    const fantasyTeams = new Map();
    const fantasyTeamsData = await prisma.fantasy_teams.findMany({
      select: { fantasy_team_key: true, name: true },
    });
    fantasyTeamsData.forEach((team) => {
      fantasyTeams.set(team.fantasy_team_key, team.name);
    });
    for (const teamKey of teamKeys) {
      const teamName = fantasyTeams.get(teamKey);
      const teamRoster = await prisma.rosters.findMany({
        where: { team_key: teamKey, NOT: { player_name: null } },
        select: {
          roster_position: true,
          player_name: true,
          nfl_team: true,
          bye_week: true,
        },
        orderBy: { display_number: 'asc' },
      });
      leagueRosters.push({ teamName, teamRoster });
    }
    return leagueRosters;
  } catch (err) {
    return console.log(err);
  }
};
/**
 * Get Array of JSON objects that contain data for top scoring players for a given year and weeks
 * @param {number} year - Four digit year that you want to get the data for
 * @param {number} weekStart - First week you want to pull data for
 * @param {number} weekEnd - Last week you want to pull data for
 * @returns {Promise<JSON[]>} Array of objects containing playerRank,playerName,points scored, and manager name for the supplied year and weeks
 */
exports.getTopTenScoringPlayersAndOwnership = async function (
  year,
  weekStart,
  weekEnd
) {
  try {
    const topScoringPlayersWithOwners = [];
    const topScoringPlayers = await getTopTenScoringPlayers(
      year,
      weekStart,
      weekEnd
    );
    for (const player of topScoringPlayers) {
      const suffixes = ['Jr.', 'Sr.', 'II'];
      let managerTeamKey;
      /*
      If a player has a suffix in their name in fantasy pros, there's a chance the name doesn't have a suffix in yahoo.
      In that scenario, we try to SELECT on the name with the suffix and wihout
      */
      if (suffixes.some((suffix) => player.name.includes(suffix))) {
        for (const suffix of suffixes) {
          if (player.name.includes(suffix)) {
            const nameNoSuffix = player.name
              .slice(0, player.name.indexOf(suffix))
              .trim();
            managerTeamKey = (
              await prisma.rosters.findFirst({
                where: {
                  OR: [
                    {
                      player_name: player.name,
                    },
                    {
                      player_name: nameNoSuffix,
                    },
                  ],
                },
                select: { team_key: true },
              })
            )?.team_key;
            break;
          }
        }
      } else {
        managerTeamKey = (
          await prisma.rosters.findFirst({
            where: {
              player_name: player.name,
            },
            select: { team_key: true },
          })
        )?.team_key;
      }
      const managerTeamName =
        managerTeamKey === undefined
          ? 'Free Agent'
          : (
              await prisma.fantasy_teams.findFirst({
                where: {
                  fantasy_team_key: managerTeamKey,
                },
                select: { name: true },
              })
            ).name;
      topScoringPlayersWithOwners.push({
        playerRank: player.rank,
        playerName: player.name,
        points: player.points,
        managerTeamName,
      });
    }
    return topScoringPlayersWithOwners;
  } catch (err) {
    return console.log(err);
  }
};
