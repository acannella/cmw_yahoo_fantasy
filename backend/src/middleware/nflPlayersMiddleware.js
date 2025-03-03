const nflPlayersQueries = require('../queries/nflPlayersQueries');

exports.getTeamRosters = async function (req, res) {
  const teams = new Map(
    Object.entries(JSON.parse(decodeURIComponent(req.query.teams)))
  );
  const rosters = await nflPlayersQueries.getRosters(teams);
  res.status(200).send(rosters);
};

exports.getTopScoringPlayersByWeek = async function (req, res) {
  const week = +req.query.week;
  const topPlayers =
    await nflPlayersQueries.getTopTenScoringPlayersAndOwnership(week);
  res.status(200).send(topPlayers);
};
