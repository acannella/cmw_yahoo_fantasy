const { PrismaClient } = require('@prisma/client');
const leagueQueries = require('./leagueQueries');
const formattedDateFromDB = require('../utils/formattedDateFromDB');

const prisma = new PrismaClient();

/**
 * Get transactions from the database for a week
 * @param {number} week Week you want to get transactions for
 * @returns {Promise<JSON[]>} Array of JSON objects with formatted transactions
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
 * Format the data from the players in transaction array so it can be used by the views
 * @param {JSON[]} transactionArray Array that contains JSON objects with transaction data
 * @returns {Promise<JSON[]>} Array of JSON objects with desired transaction data
 */
const formatTransaction = async function (transactionArray) {
  const formattedTransactionsArray = [];
  const fantasyTeams = new Map();
  const fantasyTeamsData = await prisma.fantasy_teams.findMany({
    select: { fantasy_team_key: true, name: true },
  });
  fantasyTeamsData.forEach((team) => {
    fantasyTeams.set(team.fantasy_team_key, team.name);
  });
  for (const transaction of transactionArray) {
    const playerName = transaction.player_name;
    const action = transaction.action;
    //Set teamkey to either the destination_team_key or source_team_key depending on what's on the transaction
    const teamKey = transaction.destination_team_key
      ? transaction.destination_team_key
      : transaction.source_team_key;
    const teamName = fantasyTeams.get(teamKey);
    const formattedTransaction = {
      teamName,
      action,
      playerName,
    };
    formattedTransactionsArray.push(formattedTransaction);
  }
  return formattedTransactionsArray;
};
