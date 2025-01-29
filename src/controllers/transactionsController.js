const transactionsQueries = require('../queries/transactionsQueries');

exports.transactionsForWeek = async function (req, res) {
  const week = +req.query.week;
  const transactions = await transactionsQueries.getTransactionsForWeek(week);
  res.status(200).send(transactions);
};
