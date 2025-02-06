const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get league related data that will be used for most queries
 * @returns {object} Object with gameKey,leagueKey, array of teamKeys
 */
exports.getLeagueMetadata = async function () {
  try {
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

exports.getLeagueStandings = async function () {
  try {
    const leagueStandings = [];
    const { leagueKey } = await this.getLeagueMetadata();
    const leagueStandingsData = await prisma.league_standings.findMany({
      where: { league_key: leagueKey },
      select: {
        wins: true,
        losses: true,
        ties: true,
        rank: true,
        points_for: true,
        points_against: true,
        fantasy_teams: { select: { name: true } },
      },
      orderBy: { rank: 'asc' },
    });
    leagueStandingsData.forEach((data) => {
      const formattedStanding = {
        wins: data.wins,
        losses: data.losses,
        ties: data.ties,
        rank: data.rank,
        points_for: data.points_for,
        points_against: data.points_against,
        teamName: data.fantasy_teams.name,
      };
      leagueStandings.push(formattedStanding);
    });
    return leagueStandings;
  } catch (err) {
    return console.log(err);
  }
};

exports.getRecordBook = async function () {
  try {
    return await prisma.record_book.findMany({
      select: {
        record_name: true,
        team_name: true,
        year: true,
        record_data: true,
      },
    });
  } catch (err) {
    return console.log(err);
  }
};

//Return year 2024 records for now, in the future maybe the year gets set in a config file or something
exports.getNewsletterLinks = async function () {
  try {
    return await prisma.newsletters.findMany({
      where: { year: 2024 },
      select: { week: true, newsletter_link: true },
    });
  } catch (err) {
    return console.log(err);
  }
};
