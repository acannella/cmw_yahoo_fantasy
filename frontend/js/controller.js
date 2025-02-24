import homePageView from '../views/homePageView.js';
import rostersPageView from '../views/rostersPageView.js';
import recordBookPageView from '../views/recordBookPageView.js';
import newsletterPageView from '../views/newsletterPageView.js';
import * as model from './model.js';

const controlTopScoringPlayersData = async function (week) {
  const topScoringPlayersData = await model.loadTopScoringPlayers(+week);
  homePageView.renderTopScoringTable(topScoringPlayersData);
};

const controlTransactionsData = async function (week) {
  const transactionsData = await model.loadTransactionsByWeek(week);
  homePageView.renderTransactionsTable(transactionsData);
};

const controlStandingsData = async function (week) {
  const standingsData = await model.loadStandingsData(+week);
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

const controlCurrentWeek = async function () {
  await model.loadCurrentWeek();
};

const controlRostersData = async function () {
  await model.loadRosterData();
};

let navListenersAdded = false;

/**
 * Set actionListeners when the page is first loaded and render the page specified by the path parameter
 * @param {String} path name of the page to render
 */
const route = function (path) {
  const paths = ['home', 'rosters', 'newsletters', 'recordbook'];
  const currentPath = window.location.pathname.slice(1);
  const options = {};
  if (!navListenersAdded) {
    options.navHandler = controlNavigation;

    window.addEventListener('popstate', (event) => {
      if (event.state) {
        homePageView.clearPageHTML();
        route(event.state.url);
      }
    });
    navListenersAdded = true;
  }

  if (paths.includes(currentPath) && !path) {
    path = currentPath;
  }

  if (!path || path === 'home') {
    options.scoringHandler = controlTopScoringPlayersData;
    options.transHandler = controlTransactionsData;
    options.standingsHandler = controlStandingsData;
    options.currentWeek = model.state.currentWeek;

    homePageView.renderHomePage(options);
    window.history.pushState({ url: 'home' }, '', '/home');
  } else if (path === 'rosters') {
    options.rosterData = model.state.rosterData;
    rostersPageView.renderRostersPage(options);
    window.history.pushState({ url: 'rosters' }, '', '/rosters');
  } else if (path === 'newsletters') {
    options.newslettersCount = model.state.newsletterLinksMap.size;
    options.currNewsletter = model.state.newsletterLinksMap.get(
      options.newslettersCount
    );
    options.newsletterHandler = controlRenderNewsletter;
    newsletterPageView.renderNewslettersPage(options);
    window.history.pushState({ url: 'newsletters' }, '', '/newsletters');
  } else if (path === 'recordbook') {
    options.recordData = model.state.recordBookData;
    recordBookPageView.renderRecordbookPage(options);
    window.history.pushState({ url: 'recordbook' }, '', '/recordbook');
  }
};

/**
 * Render the page that corresponds with the button that was clicked
 * @param {String} buttonID ID of the button element that was clicked
 */

const controlNavigation = function (buttonID) {
  if (buttonID.includes('home')) {
    route('home');
  }
  if (buttonID.includes('rosters')) {
    if (model.state.rosterData) {
      route('rosters');
    }
  }
  if (buttonID.includes('newsletters')) {
    route('newsletters');
  }
  if (buttonID.includes('record')) {
    route('recordbook');
  }
};

/**
 * Call the functions to get the data from the model to pass to the views
 */

const initSite = async function () {
  try {
    await controlCurrentWeek();
    await controlRecordBookData();
    await controlNewslettersData();
    await controlRostersData();
    route();
  } catch (err) {
    homePageView.renderError();
  }
};

await initSite();
