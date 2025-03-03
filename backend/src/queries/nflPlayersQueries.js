const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get roster data for every team in the league
 * @returns {Promise<JSON[]>} Array of JSON Objects which contain roster data for each team
 */

exports.getRosters = async function (teams) {
  try {
    const leagueRosters = [];
    const fantasyTeams = teams;
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
 * @param {number} week - Week to get top scoring data for
 * @returns {Promise<JSON[]>} Array of objects containing playerRank,playerName,points scored, and manager name for the supplied year and weeks
 */
exports.getTopTenScoringPlayersAndOwnership = async function (week) {
  try {
    return await prisma.top_scoring_players.findMany({
      where: { week: week },
      select: { rank: true, player_name: true, points: true, manager: true },
      orderBy: { rank: 'asc' },
    });
  } catch (err) {
    return console.log(err);
  }
};
