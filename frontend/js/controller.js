import homePageView from '../views/homePageView.js';
import rostersPageView from '../views/rostersPageView.js';
import aboutPageView from '../views/aboutPageView.js';
import recordBookPageView from '../views/recordBookPageView.js';
import newsletterPageView from '../views/newsletterPageView.js';
import * as model from './model.js';

let navListenersAdded = false;

const controlTopScoringPlayersData = async function (week) {
  const topScoringPlayersData = await model.loadTopScoringPlayers(week);
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
  //Dispatch event after roster data is loaded, this will remove the loading icon when navigating to the Rosters page
  const rostersLoadedEvent = new Event('rosters_loaded');
  window.dispatchEvent(rostersLoadedEvent);
};

const route = async function (path) {
  const paths = ['home', 'rosters', 'newsletters', 'recordbook', 'about'];
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
    if (!model.state.rosterData) rostersPageView.displayLoadingIcon();
    rostersPageView.clearPageHTML();
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
  } else if (path === 'about') {
    aboutPageView.renderAboutPage(options);
    window.history.pushState({ url: 'about' }, '', '/about');
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
  if (buttonID.includes('about')) {
    route('about');
  }
};

/**
 * Call the functions to get the data from the model to pass to the views
 */

const init = async function () {
  await controlCurrentWeek();
  await controlRecordBookData();
  await controlNewslettersData();
  await controlRostersData();
  await route();
};

await init();
