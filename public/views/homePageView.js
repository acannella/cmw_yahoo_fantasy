import View from './view.js';

class HomePageView extends View {
  constructor() {
    super();
  }

  #setPageElements() {
    this.topScoringDropdown = document.querySelector('#top-scoring-dropdown');
    this.topScoringTableBody = document.querySelector(
      '#top-scoring-players-table tbody'
    );
    this.transactionsDropdown = document.querySelector(
      '#transactions-dropdown'
    );
    this.transactionsTableBody = document.querySelector(
      '#transactions-table tbody'
    );
    this.standingsTableBody = document.querySelector('#standings-table tbody');
  }

  #setDropdownHandlers(scoringHandler, transHandler) {
    const self = this;
    this.topScoringDropdown.addEventListener('change', function () {
      const topScoringDropdownValue = self.topScoringDropdown.value;
      self.topScoringTableBody.innerHTML = '';
      scoringHandler(+topScoringDropdownValue);
    });
    this.transactionsDropdown.addEventListener('change', function () {
      const transactionsDropdownValue = self.transactionsDropdown.value;
      self.transactionsTableBody.innerHTML = '';
      transHandler(+transactionsDropdownValue);
    });
  }

  #initTables() {
    const topScoringTable = `<div class="data-container"><table id="top-scoring-players-table">
          <thead>
            <tr>
              <th colspan="4" class="table-header">Top Scoring Players</th>
            </tr>
            <tr class="column-names">
              <th>Rank</th>
              <th>Player Name</th>
              <th>Points</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table><div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown" id="top-scoring-dropdown"><option value="1">1</option><option value="2">2</option></select></div></div><div class="spacer"></div>`;
    const transactionsTable = `<div class="data-container"><table id="transactions-table">
          <thead>
            <tr>
              <th colspan="4" class="table-header">Transactions</th>
            </tr>
            <tr class="column-names">
              <th>Team Name</th>
              <th>Action</th>
              <th>Players(s)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table><div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown" id="transactions-dropdown"><option value="1">1</option><option value="2">2</option></select></div></div><div class="spacer"></div>`;
    const standingsTable = `<div class="data-container"><table id="standings-table">
          <thead>
            <tr>
              <th colspan="5" class="table-header">Standings</th>
            </tr>
            <tr class="column-names">
              <th>Rank</th>
              <th>Team Name</th>
              <th>Record</th>
              <th>Points For</th>
              <th>Points Against</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table><div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown" id="standings-dropdown"><option value="1">1</option></select></div></div>`;

    document
      .querySelector('.page-container')
      .insertAdjacentHTML(
        'afterbegin',
        topScoringTable + transactionsTable + standingsTable
      );
  }

  initHomePage(scoringHandler, transHandler, standingsHandler, navHandler) {
    this.header.insertAdjacentHTML('afterend', this.generateContainers());
    this.#initTables();
    this.#setPageElements();
    this.#setDropdownHandlers(scoringHandler, transHandler);
    super.addNavigationHandler(navHandler);
    const topScoringDropdownValue = this.topScoringDropdown.value;
    const transactionsDropdownValue = this.transactionsDropdown.value;
    scoringHandler(+topScoringDropdownValue);
    transHandler(+transactionsDropdownValue);
    standingsHandler();
  }

  #generateTableRow(data) {
    let rowString = '';
    data.forEach((el) => {
      rowString += `<td>${el}</td>`;
    });
    return `<tr>${rowString}</tr>`;
  }

  //This gets called by the controller after it gets the data from the model
  renderTopScoringTable(playerData) {
    playerData.forEach((player) => {
      const row = this.#generateTableRow([
        player.playerRank,
        player.playerName,
        player.points,
        player.managerTeamName,
      ]);
      this.topScoringTableBody.insertAdjacentHTML('beforeend', row);
    });
  }

  renderTransactionsTable(transactionsData) {
    transactionsData.forEach((transaction) => {
      let actionHTMLString;
      let playerHTMLString;
      let teamName;
      let teamNameHTMLString;
      const transactionDate = `${transaction.date}`;
      transaction.formattedTransactions.forEach((data, index) => {
        //if first element, set the action, player, and team name
        if (index < 1) {
          actionHTMLString = `${data.action}`;
          playerHTMLString = `${data.playerName}`;
          teamName = data.teamName;
          teamNameHTMLString = `${teamName}`;
        } else {
          //Iteration beyond the first, if action is not trade, append it
          actionHTMLString += !data.action.includes('trade')
            ? `<div>${data.action}</div>`
            : '';
          //if teamName that was set in iteration 1 equals the current teamname data.teamName, then append the player as normal
          if (teamName === data.teamName) {
            playerHTMLString += `<div>${data.playerName}</div>`;
          } else {
            //this is a trade since another team is involved in the transaction, append with the class which differentiates the players and teamnames
            teamNameHTMLString += `<div class="trade-to">${data.teamName}</div>`;
            playerHTMLString += `<div class="trade-to">${data.playerName}</div>`;
          }
        }
      });
      const row = this.#generateTableRow([
        teamNameHTMLString,
        actionHTMLString,
        playerHTMLString,
        transactionDate,
      ]);
      this.transactionsTableBody.insertAdjacentHTML('beforeend', row);
    });
  }

  renderStandingsTable(standingsData) {
    standingsData.forEach((data) => {
      const record = `${data.wins}-${data.losses}-${data.ties}`;
      const row = this.#generateTableRow([
        data.rank,
        data.teamName,
        record,
        data.points_for,
        data.points_against,
      ]);
      this.standingsTableBody.insertAdjacentHTML('beforeend', row);
    });
  }
}

export default new HomePageView();
