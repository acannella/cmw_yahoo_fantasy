const API_URL = 'http://localhost:3000/api/v1';

export const state = {
  topScoringMap: new Map(),
  transactionsMap: new Map(),
  standingsMap: new Map(),
  newsletterLinksMap: new Map(),
};

export const loadTopScoringPlayers = async function (week) {
  if (!state.topScoringMap.has(week)) {
    const topScoringCall = await fetch(
      `${API_URL}/topscoringplayers?week=${week}`
    );
    const topScoringPlayersData = await topScoringCall.json();
    state.topScoringMap.set(week, topScoringPlayersData);
    return state.topScoringMap.get(week);
  } else {
    return state.topScoringMap.get(week);
  }
};

export const loadTransactionsByWeek = async function (week) {
  if (!state.transactionsMap.has(week)) {
    const transactionsCall = await fetch(
      `${API_URL}/transactions?week=${week}&leagueKey=${state.metadata.leagueKey}&teams=${state.metadata.fantasyTeamsEncoded}`
    );

    const transactionsData = await transactionsCall.json();
    state.transactionsMap.set(week, transactionsData);
    return state.transactionsMap.get(week);
  } else {
    return state.transactionsMap.get(week);
  }
};

export const loadStandingsData = async function (week) {
  if (!state.standingsMap.has(week)) {
    const standingsCall = await fetch(
      `${API_URL}/standings?week=${week}&leagueKey=${state.metadata.leagueKey}&teams=${state.metadata.fantasyTeamsEncoded}`
    );
    const standingsData = await standingsCall.json();
    state.standingsMap.set(week, standingsData);
    return state.standingsMap.get(week);
  } else {
    return state.standingsMap.get(week);
  }
};

export const loadRecordBookData = async function () {
  if (!state.recordBookData) {
    const recordBookCall = await fetch(`${API_URL}/recordbook`);
    state.recordBookData = await recordBookCall.json();
    return state.recordBookData;
  } else {
    return state.recordBookData;
  }
};

export const loadRosterData = async function () {
  if (!state.rosterData) {
    const rostersCall = await fetch(
      `${API_URL}/rosters?teams=${state.metadata.fantasyTeamsEncoded}`
    );
    state.rosterData = await rostersCall.json();
    return state.rosterData;
  } else {
    return state.rosterData;
  }
};

export const loadNewsletterData = async function () {
  if (state.newsletterLinksMap.size === 0) {
    const newsletterLinksCall = await fetch(`${API_URL}/newsletters`);
    const newsletterLinksData = await newsletterLinksCall.json();

    newsletterLinksData.forEach((element) => {
      state.newsletterLinksMap.set(element.week, element.newsletter_link);
    });
  }
};

export const loadMetadata = async function () {
  const metadata = await fetch(`${API_URL}/metadata`);
  state.metadata = await metadata.json();
  state.metadata.fantasyTeamsEncoded = encodeURIComponent(
    state.metadata.fantasyTeamsJSON
  );
};
