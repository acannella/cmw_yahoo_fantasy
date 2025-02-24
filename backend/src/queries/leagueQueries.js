const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get league related data that will be used for most queries
 * @returns {Promise<JSON>} Object with gameKey,leagueKey,current week, array of teamKeys
 */
exports.getLeagueMetadata = async function () {
  try {
    const gameKey = (
      await prisma.league_metadata.aggregate({
        _max: { game_key: true },
      })
    )._max.game_key;

    const leagueData = await prisma.league_metadata.findFirst({
      where: { game_key: gameKey },
      select: { league_key: true, current_week: true },
    });

    const leagueKey = leagueData.league_key;
    const currentWeek = leagueData.current_week;

    return { gameKey, leagueKey, currentWeek };
  } catch (err) {
    return console.log(err);
  }
};

/**
 * Get standings data for each team in the league based on a given week
 * @param {number} week Week number to get the standings data for
 * @returns {Promise<JSON[]>} Array of JSON objects containing standing data for each team in league
 */

exports.getLeagueStandings = async function (week, leagueKey) {
  try {
    const leagueStandings = [];
    const leagueStandingsData = await prisma.league_standings.findMany({
      where: { league_key: leagueKey, week: week },
      select: {
        wins: true,
        losses: true,
        ties: true,
        rank: true,
        points_for: true,
        points_against: true,
        change: true,
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
        change: data.change,
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

/**
 * Get recordBook data from the database
 * @returns {Promise<JSON[]>} Array of JSON objects containing data from the recordBook table
 */

exports.getRecordBook = async function () {
  try {
    const records = await prisma.record_book.findMany({
      select: {
        record_name: true,
        team_name: true,
        year: true,
        record_data: true,
      },
      orderBy: { year: 'desc' },
    });
    const leagueWinners = [];
    const otherRecords = [];
    records.forEach((record) => {
      if (record.record_name === 'League Winner') leagueWinners.push(record);
      else otherRecords.push(record);
    });
    return { leagueWinners, otherRecords };
  } catch (err) {
    return console.log(err);
  }
};

/**
 * Get newsletter data from the database
 * @returns {Promise<JSON[]>} Array of JSON objects containing newsletter data from DB
 */

//Returns year 2024 records for now, in the future maybe the year gets set in a config file or it gets passed in as a parameter
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
