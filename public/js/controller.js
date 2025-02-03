import homePageView from '../views/homePageView.js';

const API_URL = 'http://localhost:3000/';

const controlTopScoringPlayersData = async function (week) {
  const topScoringCall = await fetch(
    `${API_URL}topScoringPlayers?year=2024&weekStart=${week}&weekEnd=${week}`
  );

  const topScoringPlayersData = await topScoringCall.json();
  homePageView.renderTopScoringTable(topScoringPlayersData);
};

const controlTransactionsData = async function (week) {
  const transactionsCall = await fetch(`${API_URL}transactions?week=${week}`);

  const transactionsData = await transactionsCall.json();
  homePageView.renderTransactionsTable(transactionsData);
};

const controlStandingsData = async function () {
  const standingsCall = await fetch(`${API_URL}standings`);
  const standingsData = await standingsCall.json();
  homePageView.renderStandingsTable(standingsData);
};

const controlNavigation = function (buttonID) {
  if (buttonID.includes('home')) {
    homePageView.rebuildHomePage();
  }
  if (buttonID.includes('rosters')) {
  }
  if (buttonID.includes('newsletters')) {
  }
  if (buttonID.includes('record')) {
  }
  if (buttonID.includes('about')) {
  }
};

homePageView.initHomePage([
  controlTopScoringPlayersData,
  controlTransactionsData,
  controlStandingsData,
  controlNavigation,
]);
