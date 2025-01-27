const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('../../utils/initYahooFantasy');
const getLeagueMetadata = require('../../utils/getLeagueMetadata');
const dateWithTimeZoneOffset = require('../../utils/dateWithTimeZoneOffset');

const prisma = new PrismaClient();

const getTransactionsForWeek = async function (week) {
  const leagueMetadata = await getLeagueMetadata();
  const gameWeek = await prisma.fantasy_weeks.findFirst({
    where: { league_key: leagueMetadata.league_key, week_number: week },
    select: { week_number: true, week_end: true, week_start: true },
  });
  const testDate = new Date(gameWeek.week_end).toLocaleString();
  const ddDate = new Date('2024-09-25 08:05:48.000').toLocaleString();
  const dbDate = dateWithTimeZoneOffset(
    '2024-09-25 08:05:48.000'
  ).toLocaleString();

  console.log(testDate);
  console.log(dbDate);
  console.log(dbDate <= testDate);
};

getTransactionsForWeek(4);
