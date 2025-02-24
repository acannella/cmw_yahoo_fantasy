const express = require('express');
const nflPlayersMiddleware = require('../src/middleware/nflPlayersMiddleware');
const transactionsMiddleware = require('../src/middleware/transactionsMiddleware');
const leagueMiddleware = require('../src/middleware/leagueMiddleware');

const router = express.Router();

router.get(`/transactions`, transactionsMiddleware.transactionsForWeek);
router.get(`/rosters`, nflPlayersMiddleware.getTeamRosters);
router.get(
  `/topscoringplayers`,
  nflPlayersMiddleware.getTopScoringPlayersByWeek
);
router.get(`/standings`, leagueMiddleware.getCurrentStandings);
router.get(`/recordbook`, leagueMiddleware.getRecordBook);
router.get(`/newsletters`, leagueMiddleware.getNewsletters);
router.get(`/metadata`, leagueMiddleware.getMetadata);

module.exports = router;
