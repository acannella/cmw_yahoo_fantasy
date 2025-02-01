const { PrismaClient } = require('@prisma/client');
const getTopTenScoringPlayers = require('../../utils/weeklyTopScoringPlayers');
const leagueQueries = require('./leagueQueries');

const prisma = new PrismaClient();

/**
 * Get all player keys for each team in the league
 * @returns {Promise<Array>} Array of objects containing the teamKey and an array of playerKeys for that team
 */
exports.getAllFantasyRosters = async function () {
  try {
    const leagueMetadata = await leagueQueries.getLeagueMetadata();
    const allFantasyRosters = [];
    for (const teamKey of leagueMetadata.teamKeys) {
      const teamRosterPlayerKeys = (
        await prisma.nfl_players.findMany({
          where: { team_key: teamKey, league_key: leagueMetadata.leagueKey },
          select: { player_key: true },
        })
      ).map((player) => player.player_key);
      const teamRoster = { teamKey, teamRosterPlayerKeys };
      allFantasyRosters.push(teamRoster);
    }
    return allFantasyRosters;
  } catch (err) {
    return console.log(err);
  }
};

/**
 *
 * @param {number} year - Four digit year that you want to get the data for
 * @param {number} weekStart - First week you want to pull data for
 * @param {number} weekEnd - Last week you want to pull data for
 * @returns {Promise<Array>}Array of objects containing playerRank,playerName,points scored, and manager name for the supplied year and weeks
 */
exports.getTopTenScoringPlayersAndOwnership = async function (
  year,
  weekStart,
  weekEnd
) {
  try {
    const topScoringPlayersWithOwners = [];
    const leagueMetadata = await leagueQueries.getLeagueMetadata();
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
              await prisma.nfl_players.findFirst({
                where: {
                  OR: [
                    {
                      player_name: player.name,
                      league_key: leagueMetadata.leagueKey,
                    },
                    {
                      player_name: nameNoSuffix,
                      league_key: leagueMetadata.leagueKey,
                    },
                  ],
                },
                select: { team_key: true },
              })
            ).team_key;
            break;
          }
        }
      } else {
        managerTeamKey = (
          await prisma.nfl_players.findFirst({
            where: {
              player_name: player.name,
              league_key: leagueMetadata.leagueKey,
            },
            select: { team_key: true },
          })
        ).team_key;
      }
      const managerTeamName = (
        await prisma.fantasy_teams.findFirst({
          where: {
            fantasy_team_key: managerTeamKey,
            league_key: leagueMetadata.leagueKey,
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
