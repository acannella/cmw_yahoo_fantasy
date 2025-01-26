const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('../../utils/initYahooFantasy');
const getLeagueMetadata = require('../../utils/getLeagueMetadata');

const prisma = new PrismaClient();

const getTransactionsForWeek = async function (week) {
  const leagueMetadata = await getLeagueMetadata();
  const gameWeek = await prisma.fantasy_weeks.findFirst({
    where: { league_key: leagueMetadata.league_key, week_number: week },
    select: { week_number: true, week_end: true, week_start: true },
  });
  const testDate = new Date(gameWeek.week_end);
  testDate.setDate(testDate.getDate() + 5);
  console.log(testDate);
};

getTransactionsForWeek(4);
