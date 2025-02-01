import tablesView from '../views/tablesView.js';

const API_URL = 'http://localhost:3000/';

const controlTopScoringPlayersData = async function (week) {
  const topScoringCall = await fetch(
    `${API_URL}topScoringPlayers?year=2024&weekStart=${week}&weekEnd=${week}`
  );

  const topScoringPlayersData = await topScoringCall.json();
  tablesView.renderTopScoringTable(topScoringPlayersData);
};

const controlTransactionsData = async function (week) {
  const transactionsCall = await fetch(`${API_URL}transactions?week=${week}`);

  const transactionsData = await transactionsCall.json();
  tablesView.renderTransactionsTable(transactionsData);
};

const controlStandingsData = async function () {
  const standingsCall = await fetch(`${API_URL}standings`);
  const standingsData = await standingsCall.json();
  tablesView.renderStandingsTable(standingsData);
};

tablesView.addHandlersPageLoad([
  controlTopScoringPlayersData,
  controlTransactionsData,
  controlStandingsData,
]);
tablesView.addHandlerTopScoringDropdown(controlTopScoringPlayersData);
tablesView.addHandlerTransactionsDropdown(controlTransactionsData);

tablesView.setUpNav();
