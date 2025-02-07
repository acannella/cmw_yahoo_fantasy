const express = require('express');
const nflPlayersMiddleware = require('../src/middleware/nflPlayersMiddleware');
const transactionsMiddleware = require('../src/middleware/transactionsMiddleware');
const leagueMiddleware = require('../src/middleware/leagueMiddleware');

const router = express.Router();
const API_PATH = '/api/v1';

router.get(
  `${API_PATH}/transactions`,
  transactionsMiddleware.transactionsForWeek
);
router.get(`${API_PATH}/rosters`, nflPlayersMiddleware.getTeamRosters);
router.get(
  `${API_PATH}/topscoringplayers`,
  nflPlayersMiddleware.getTopScoringPlayersByWeek
);
router.get(`${API_PATH}/standings`, leagueMiddleware.getCurrentStandings);
router.get(`${API_PATH}/recordbook`, leagueMiddleware.getRecordBook);
router.get(`${API_PATH}/newsletters`, leagueMiddleware.getNewsletters);
router.get(`${API_PATH}/metadata`, leagueMiddleware.getCurrentWeek);

module.exports = router;
