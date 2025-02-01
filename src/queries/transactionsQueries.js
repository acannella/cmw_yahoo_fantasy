const { PrismaClient } = require('@prisma/client');
const leagueQueries = require('./leagueQueries');
const formattedDateFromDB = require('../../utils/formattedDateFromDB');

const prisma = new PrismaClient();

/**
 * @param {number} week Week you want to get transactions for
 * @returns Array with formatted transactions
 */
exports.getTransactionsForWeek = async function (week) {
  const leagueMetadata = await leagueQueries.getLeagueMetadata();
  //Get the week_start and week_end values from the DB based on supplied week
  const gameWeek = await prisma.fantasy_weeks.findFirst({
    where: { league_key: leagueMetadata.league_key, week_number: week },
    select: { week_number: true, week_end: true, week_start: true },
  });
  const weekStart = new Date(gameWeek.week_start);
  const weekEnd = new Date(gameWeek.week_end);

  //Get all transactions that fall within the specified week
  const transactions = await prisma.transactions.findMany({
    where: {
      AND: [
        {
          transaction_date: { gte: weekStart },
        },
        { transaction_date: { lte: weekEnd } },
      ],
    },
    select: { transaction_date: true, players_in_transaction: true },
    orderBy: { transaction_date: 'desc' },
  });
  const parsedTransactions = [];
  for (const transaction of transactions) {
    const formattedTransactions = await formatTransaction(
      transaction.players_in_transaction
    );
    //Use toLocaleString to save the date as something more human readable
    parsedTransactions.push({
      date: formattedDateFromDB(transaction.transaction_date).toLocaleString(),
      formattedTransactions,
    });
  }
  return parsedTransactions;
};

/**
 * @param {Array} transactionArray Array that contains JSON objects with transaction data
 * @returns Array of JSON objects with desired transaction data
 */
const formatTransaction = async function (transactionArray) {
  const formattedTransactionsArray = [];
  for (const transaction of transactionArray) {
    //Get playername
    const playerName = (
      await prisma.nfl_players.findFirst({
        where: { player_key: transaction.player_key },
        select: { player_name: true },
      })
    ).player_name;
    const action = transaction.action;
    //Set teamkey to either the destination_team_key or source_team_key depending on what's on the transaction
    const teamKey = transaction.destination_team_key
      ? transaction.destination_team_key
      : transaction.source_team_key;
    const teamName = (
      await prisma.fantasy_teams.findFirst({
        where: { fantasy_team_key: teamKey },
        select: { name: true },
      })
    ).name;
    const formattedTransaction = {
      teamName,
      action,
      playerName,
    };
    formattedTransactionsArray.push(formattedTransaction);
  }
  return formattedTransactionsArray;
};
