const transactionsQueries = require('../queries/transactionsQueries');

exports.transactionsForWeek = async function (req, res) {
  const week = +req.query.week;
  const leagueKey = req.query.leagueKey;
  const transactions = await transactionsQueries.getTransactionsForWeek(
    week,
    leagueKey
  );
  res.status(200).send(transactions);
};
