const leagueQueries = require('../queries/leagueQueries');

exports.getCurrentStandings = async function (req, res) {
  const week = +req.query.week;
  const leagueKey = req.query.leagueKey;
  const standings = await leagueQueries.getLeagueStandings(week, leagueKey);
  res.status(200).send(standings);
};

exports.getRecordBook = async function (req, res) {
  const recordBook = await leagueQueries.getRecordBook();
  res.status(200).send(recordBook);
};

exports.getNewsletters = async function (req, res) {
  const newsletterLinks = await leagueQueries.getNewsletterLinks();
  res.status(200).send(newsletterLinks);
};

exports.getMetadata = async function (req, res) {
  const metadata = await leagueQueries.getLeagueMetadata();
  res.status(200).send(metadata);
};
