const leagueQueries = require('../queries/leagueQueries');

exports.getCurrentStandings = async function (req, res) {
  const standings = await leagueQueries.getLeagueStandings();
  res.status(200).send(standings);
};

exports.getRecordBook = async function (req, res) {
  const recordBook = await leagueQueries.getRecordBook();
  res.status(200).send(recordBook);
};
