const leagueQueries = require('../queries/leagueQueries');

exports.getCurrentStandings = async function (req, res) {
  const week = +req.query.week;
  const standings = await leagueQueries.getLeagueStandings(week);
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

exports.getCurrentWeek = async function (req, res) {
  const currentWeekData = await leagueQueries.getLeagueMetadata();
  res.status(200).send({ currentWeek: currentWeekData.currentWeek });
};
