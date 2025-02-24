const { PrismaClient } = require('@prisma/client');
const getTopTenScoringPlayers = require('../utils/weeklyTopScoringPlayers');
const fantasyTeamNamesMap = require('../utils/fantasyTeamNamesMap');

const prisma = new PrismaClient();

/**
 * Get roster data for every team in the league
 * @returns {Promise<JSON[]>} Array of JSON Objects which contain roster data for each team
 */

exports.getRosters = async function () {
  try {
    const leagueRosters = [];
    const fantasyTeams = await fantasyTeamNamesMap();
    const leagueRosterMap = new Map();
    for (const teamKey of fantasyTeams.keys()) {
      leagueRosterMap.set(teamKey, []);
    }
    const allPlayers = await prisma.rosters.findMany({
      where: { NOT: { player_name: null } },
      select: {
        team_key: true,
        roster_position: true,
        player_name: true,
        nfl_team: true,
        bye_week: true,
      },
      orderBy: [{ team_key: 'asc' }, { display_number: 'asc' }],
    });
    allPlayers.forEach((player) => {
      leagueRosterMap.get(player.team_key).push(player);
    });
    leagueRosterMap.keys().forEach((key) => {
      const teamName = fantasyTeams.get(key);
      const teamRoster = leagueRosterMap.get(key);
      leagueRosters.push({ teamName, teamRoster });
    });
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
    const fantasyTeams = await fantasyTeamNamesMap();
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
          : fantasyTeams.get(managerTeamKey);
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
