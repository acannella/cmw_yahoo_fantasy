const leagueQueries = require('../queries/leagueQueries');

exports.getCurrentStandings = async function (req, res) {
  const standings = await leagueQueries.getLeagueStandings();
  res.status(200).send(standings);
};
