const express = require('express');
const nflPlayersMiddleware = require('../src/middleware/nflPlayersMiddleware');
const transactionsMiddleware = require('../src/middleware/transactionsMiddleware');
const leagueMiddleware = require('../src/middleware/leagueMiddleware');

const router = express.Router();

router.get('/transactions', transactionsMiddleware.transactionsForWeek);
router.get('/rosters', nflPlayersMiddleware.getTeamRosters);
router.get(
  '/topScoringPlayers',
  nflPlayersMiddleware.getTopScoringPlayersByWeek
);
router.get('/standings', leagueMiddleware.getCurrentStandings);

module.exports = router;
