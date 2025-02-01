const express = require('express');
const nflPlayersMiddleware = require('../src/middleware/nflPlayersMiddleware');
const transactionsMiddleware = require('../src/middleware/transactionsMiddleware');

const router = express.Router();

router.get('/transactions', transactionsMiddleware.transactionsForWeek);
router.get('/rosters', nflPlayersMiddleware.getTeamRosters);
router.get(
  '/topScoringPlayers',
  nflPlayersMiddleware.getTopScoringPlayersByWeek
);

module.exports = router;
