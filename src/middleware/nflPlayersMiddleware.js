const nflPlayersQueries = require('../queries/nflPlayersQueries');

exports.getTeamRosters = async function (req, res) {
  const rosters = await nflPlayersQueries.getRosters();
  res.status(200).send(rosters);
};

exports.getTopScoringPlayersByWeek = async function (req, res) {
  const { year, weekStart, weekEnd } = req.query;
  const topPlayers =
    await nflPlayersQueries.getTopTenScoringPlayersAndOwnership(
      year,
      weekStart,
      weekEnd
    );
  res.status(200).send(topPlayers);
};
