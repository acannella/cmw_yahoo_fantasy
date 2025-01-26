const { PrismaClient } = require('@prisma/client');

/**
 * Get league related data that will be used for most queries
 * @returns {object} Object with gameKey,leagueKey, array of teamKeys
 */
const getLeagueMetadata = async function () {
  try {
    const prisma = new PrismaClient();
    const gameKey = (
      await prisma.league_metadata.aggregate({
        _max: { game_key: true },
      })
    )._max.game_key;

    const leagueKey = (
      await prisma.league_metadata.findFirst({
        where: { game_key: gameKey },
      })
    ).league_key;

    const teamKeys = (
      await prisma.fantasy_teams.findMany({
        where: { league_key: leagueKey },
        where: { fantasy_team_key: { not: 'FA' } },
        select: { fantasy_team_key: true },
      })
    ).map((teamKeyObj) => teamKeyObj.fantasy_team_key);

    return { gameKey, leagueKey, teamKeys };
  } catch (err) {
    return console.log(err);
  }
};

module.exports = getLeagueMetadata;
