import homePageView from '../views/homePageView.js';
import rostersPageView from '../views/rostersPageView.js';
import aboutPageView from '../views/aboutPageView.js';
import recordBookPageView from '../views/recordBookView.js';

const API_URL = 'http://localhost:3000/api/v1';
let rosterData;
let rosterDataLoaded = false;

const controlTopScoringPlayersData = async function (week) {
  const topScoringCall = await fetch(
    `${API_URL}/topscoringplayers?year=2024&weekStart=${week}&weekEnd=${week}`
  );

  const topScoringPlayersData = await topScoringCall.json();
  homePageView.renderTopScoringTable(topScoringPlayersData);
};

const controlTransactionsData = async function (week) {
  const transactionsCall = await fetch(`${API_URL}/transactions?week=${week}`);

  const transactionsData = await transactionsCall.json();
  homePageView.renderTransactionsTable(transactionsData);
};

const controlStandingsData = async function () {
  const standingsCall = await fetch(`${API_URL}/standings`);
  const standingsData = await standingsCall.json();
  homePageView.renderStandingsTable(standingsData);
};
const controlRecordBookData = async function () {
  const recordBookCall = await fetch(`${API_URL}/recordbook`);
  const recordBookData = await recordBookCall.json();
  recordBookPageView.displayRecords(recordBookData);
};

//If this rosterData hasn't been stored yet, get the data, store the data, dispatch event
const controlRostersData = async function () {
  if (!rosterData) {
    const rostersCall = await fetch(`${API_URL}/rosters`);
    rosterData = await rostersCall.json();
    rosterDataLoaded = true;
    const event = new Event('rosters_loaded');
    window.dispatchEvent(event);
  }
};

const controlNavigation = function (buttonID) {
  if (buttonID.includes('home')) {
    homePageView.rebuildHomePage();
  }
  if (buttonID.includes('rosters')) {
    rostersPageView.displayLoadingIcon();
    if (rosterDataLoaded) {
      rostersPageView.clearHTML();
      rostersPageView.displayRosters(rosterData);
    }
  }
  if (buttonID.includes('newsletters')) {
  }
  if (buttonID.includes('record')) {
    controlRecordBookData();
  }
  if (buttonID.includes('about')) {
    aboutPageView.renderAboutPage();
  }
};

const init = function () {
  controlRostersData();
  homePageView.initHomePage([
    controlTopScoringPlayersData,
    controlTransactionsData,
    controlStandingsData,
    controlNavigation,
  ]);
};

init();
