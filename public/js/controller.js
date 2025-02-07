import homePageView from '../views/homePageView.js';
import rostersPageView from '../views/rostersPageView.js';
import aboutPageView from '../views/aboutPageView.js';
import recordBookPageView from '../views/recordBookPageView.js';
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

const controlNewslettersData = async function () {
  await model.loadNewsletterData();
};

const controlRenderNewsletter = async function (week) {
  newsletterPageView.renderNewsletter(
    week,
    model.state.newsletterLinksMap.get(+week)
  );
};

//Render the homepage in this function since we need the current week data to populate the dropdowns on the page
const controlCurrentWeek = async function () {
  await model.loadCurrentWeek();
  homePageView.initHomePage(
    controlTopScoringPlayersData,
    controlTransactionsData,
    controlStandingsData,
    controlNavigation,
    model.state.currentWeek
  );
};

//Dispatch event after roster data is loaded, this will remove the loading icon when navigating to the Rosters page
const controlRostersData = async function () {
  await model.loadRosterData();
  const rostersLoadedEvent = new Event('rosters_loaded');
  window.dispatchEvent(rostersLoadedEvent);
};

const controlNavigation = function (buttonID) {
  if (buttonID.includes('home')) {
    homePageView.initHomePage(
      controlTopScoringPlayersData,
      controlTransactionsData,
      controlStandingsData,
      controlNavigation,
      model.state.currentWeek
    );
  }
  if (buttonID.includes('rosters')) {
    if (!model.state.rosterData) rostersPageView.displayLoadingIcon();
    if (model.state.rosterData) {
      rostersPageView.clearHTML();
      rostersPageView.displayRosters(model.state.rosterData);
    }
  }
  if (buttonID.includes('newsletters')) {
    const newslettersCount = model.state.newsletterLinksMap.size;
    const currNewsletter = model.state.newsletterLinksMap.get(newslettersCount);
    newsletterPageView.renderPage(
      newslettersCount,
      currNewsletter,
      controlRenderNewsletter
    );
  }
  if (buttonID.includes('record')) {
    recordBookPageView.displayRecords(model.state.recordBookData);
  }
  if (buttonID.includes('about')) {
    aboutPageView.renderAboutPage();
  }
};

const init = function () {
  controlCurrentWeek();
  controlRecordBookData();
  controlNewslettersData();
  controlRostersData();
};

init();
