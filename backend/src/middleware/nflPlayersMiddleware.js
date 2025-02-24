const nflPlayersQueries = require('../queries/nflPlayersQueries');

exports.getTeamRosters = async function (req, res) {
  const rosters = await nflPlayersQueries.getRosters();
  res.status(200).send(rosters);
};

exports.getTopScoringPlayersByWeek = async function (req, res) {
  const week = +req.query.week;
  const topPlayers =
    await nflPlayersQueries.getTopTenScoringPlayersAndOwnership(week);
  res.status(200).send(topPlayers);
};
