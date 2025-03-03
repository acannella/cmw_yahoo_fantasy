const transactionsQueries = require('../queries/transactionsQueries');

exports.transactionsForWeek = async function (req, res) {
  const week = +req.query.week;
  const leagueKey = req.query.leagueKey;
  const teams = new Map(
    Object.entries(JSON.parse(decodeURIComponent(req.query.teams)))
  );
  const transactions = await transactionsQueries.getTransactionsForWeek(
    week,
    leagueKey,
    teams
  );
  res.status(200).send(transactions);
};
