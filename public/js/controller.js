import homePageView from '../views/homePageView.js';
import rostersPageView from '../views/rostersPageView.js';
import aboutPageView from '../views/aboutPageView.js';
import recordBookPageView from '../views/recordBookView.js';
import newsletterPageView from '../views/newsletterPageView.js';
import * as model from './model.js';

const controlTopScoringPlayersData = async function (week) {
  const topScoringPlayersData = await model.loadTopScoringPlayers(week);
  homePageView.renderTopScoringTable(topScoringPlayersData);
};

const controlTransactionsData = async function (week) {
  const transactionsData = await model.loadTransactionsByWeek(week);
  homePageView.renderTransactionsTable(transactionsData);
};

const controlStandingsData = async function () {
  const standingsData = await model.loadStandingsData();
  homePageView.renderStandingsTable(standingsData);
};
const controlRecordBookData = async function () {
  await model.loadRecordBookData();
};

//Dispatch event after roster data is loaded, this will remove the loading icon when navigating to the Rosters page
const controlRostersData = async function () {
  await model.loadRosterData();
  const rostersLoadedEvent = new Event('rosters_loaded');
  window.dispatchEvent(rostersLoadedEvent);
};

const controlNavigation = function (buttonID) {
  if (buttonID.includes('home')) {
    homePageView.rebuildHomePage();
  }
  if (buttonID.includes('rosters')) {
    if (!model.state.rosterData) rostersPageView.displayLoadingIcon();
    if (model.state.rosterData) {
      rostersPageView.clearHTML();
      rostersPageView.displayRosters(model.state.rosterData);
    }
  }
  if (buttonID.includes('newsletters')) {
    newsletterPageView.renderPage();
  }
  if (buttonID.includes('record')) {
    recordBookPageView.displayRecords(model.state.recordBookData);
  }
  if (buttonID.includes('about')) {
    aboutPageView.renderAboutPage();
  }
};

const init = function () {
  controlRecordBookData();
  controlRostersData();
  homePageView.initHomePage([
    controlTopScoringPlayersData,
    controlTransactionsData,
    controlStandingsData,
    controlNavigation,
  ]);
};

init();
