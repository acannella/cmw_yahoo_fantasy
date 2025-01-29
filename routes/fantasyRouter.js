const express = require('express');
const nflPlayersController = require('../src/controllers/nflPlayersController');
const transactionsController = require('../src/controllers/transactionsController');

const router = express.Router();

router.get('/transactions', transactionsController.transactionsForWeek);
router.get('/rosters', nflPlayersController.getTeamRosters);
router.get(
  '/topScoringPlayers',
  nflPlayersController.getTopScoringPlayersByWeek
);

module.exports = router;
