import View from './view.js';

class HomePageView extends View {
  constructor() {
    super();
  }

  /**
   * Assign important page elements to variables
   */

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
    this.standingsDropdown = document.querySelector('#standings-dropdown');
  }

  /**
   * Add event listeners to the dropdowns for top scoring players table and transactions table
   * @param {function} scoringHandler function to execute when scoring dropdown changes
   * @param {function} transHandler function to execute when transaction dropdown changes
   */

  #setDropdownHandlers(scoringHandler, transHandler, standingsHandler) {
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
    this.standingsDropdown.addEventListener('change', function () {
      const standingsDropdownValue = self.standingsDropdown.value;
      console.log();
      self.standingsTableBody.innerHTML = '';
      standingsHandler(+standingsDropdownValue);
    });
  }

  /**
   * Insert table and dropdown html into the homepage
   * @param {number} currentWeek Current fantasy week used to generate the dropdown options in dropdownOptions function
   */

  #initTables(currentWeek) {
    const dropdownOptions = this.#dropdownOptions(currentWeek);
    const standingsDropdownOptions =
      this.#standingsDropdownOptions(currentWeek);
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
        </table><div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown" id="top-scoring-dropdown">${dropdownOptions}</select></div></div><div class="spacer"></div>`;
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
        </table><div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown" id="transactions-dropdown">${dropdownOptions}</select></div></div><div class="spacer"></div>`;
    const standingsTable = `<div class="data-container"><table id="standings-table">
          <thead>
            <tr>
              <th colspan="6" class="table-header">Standings</th>
            </tr>
            <tr class="column-names">
              <th>Rank</th>
              <th>Team Name</th>
              <th>Record</th>
              <th>Change</th>
              <th>Points For</th>
              <th>Points Against</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table><div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown" id="standings-dropdown">${standingsDropdownOptions}</select></div></div>`;

    document
      .querySelector('.page-container')
      .insertAdjacentHTML(
        'afterbegin',
        topScoringTable + transactionsTable + standingsTable
      );
  }

  /**
   * Create HTML string for dropdown options
   * @param {number} currentWeek Number of current fantasy week
   * @returns {String} HTML dropdown options
   */

  #dropdownOptions(currentWeek) {
    let options = '';
    for (let i = 1; i <= currentWeek; i++) {
      options += `<option value="${i}">${i}</option>`;
    }
    return options;
  }

  #standingsDropdownOptions(currentWeek) {
    let options = '';
    const endOfRegularSeason = 14;
    const limit =
      currentWeek <= endOfRegularSeason ? currentWeek : endOfRegularSeason;
    for (let i = 1; i <= limit; i++) {
      options += `<option value="${i}">${i}</option>`;
    }
    return options;
  }

  /**
   * Setup tables, dropdowns, and attach actionListeners to dropdowns
   * @param {Object} options Object containing data to render the Home Page:scoringHandler, transactionsHandler, standingsHandler, currentWeek, and nav handler if it hasn't already been applied
   */

  renderHomePage(options) {
    this.header.insertAdjacentHTML('afterend', this.generateContainers());
    this.#initTables(options.currentWeek);
    this.#setPageElements();
    this.#setDropdownHandlers(
      options.scoringHandler,
      options.transHandler,
      options.standingsHandler
    );
    if (options.navHandler) super.addNavigationHandler(options.navHandler);
    options.scoringHandler(+this.topScoringDropdown.value);
    options.transHandler(+this.transactionsDropdown.value);
    options.standingsHandler(+this.standingsDropdown.value);
  }

  /**
   * Generate HTML string for a table row based on supplied data
   * @param {String[]} data Array of strings that represents the data for a table row
   * @returns {String} HTML table row String
   */

  #generateTableRow(data) {
    let rowString = '';
    data.forEach((el) => {
      rowString += `<td>${el}</td>`;
    });
    return `<tr>${rowString}</tr>`;
  }

  /**
   * Insert top scoring player data into the top scoring table
   * @param {JSON} playerData JSON Data containing data of top scoring players for a week
   */
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

  /**
   * Insert transaction data into the transactions table
   * @param {JSON} transactionsData JSON Data containing data of transactions for a week
   */

  renderTransactionsTable(transactionsData) {
    transactionsData.forEach((transaction) => {
      let actionHTMLString;
      let playerHTMLString;
      let teamName;
      let teamNameHTMLString;
      const transactionDate = `${transaction.date}`;
      transaction.formattedTransactions.forEach((data, index) => {
        const plusIcon = `<img src="./img/green_plus_sign.svg" class="plus-sign" alt="plus"/>`;
        const minusIcon = `<img src="./img/red_minus_sign.svg" class="minus-sign" alt="minus"/>`;
        const tradeIcon = `<img src="./img/blue_trade_arrows.svg" class="trade-arrows" alt="trade"/>`;
        //Set icon html string based on the type of transaction
        const icon = `${
          data.action === 'add'
            ? plusIcon
            : data.action === 'drop'
            ? minusIcon
            : tradeIcon
        }`;

        //if first element, set the action, player, and team name
        if (index < 1) {
          actionHTMLString = `<div>${icon} ${data.action}</div>`;
          playerHTMLString = `${data.playerName}`;
          teamName = data.teamName;
          teamNameHTMLString = `${teamName}`;
        } else {
          //Iteration beyond the first, if action is not trade, append it
          actionHTMLString += !data.action.includes('trade')
            ? `<div>${icon} ${data.action}</div>`
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

  /**
   * Insert team standings data into the standings table
   * @param {JSON} standingsData JSON Data containing data of the standings for a week
   */

  renderStandingsTable(standingsData) {
    standingsData.forEach((data) => {
      const record = `${data.wins}-${data.losses}-${data.ties}`;
      const upIcon = `<img src="./img/green_up_arrow.svg" class="up-arrow" alt="up-arrow"/>`;
      const downIcon = `<img src="./img/red_down_arrow.svg" class="down-arrow" alt="down-arrow"/>`;
      const noChangeIcon = `<img src="./img/black_minus_sign.svg" class="no-change" alt="no-change"/>`;
      const changeData =
        data.change === 0
          ? noChangeIcon
          : data.change > 0
          ? `${upIcon} ${data.change}`
          : `${downIcon}  ${Math.abs(data.change)}`;
      const row = this.#generateTableRow([
        data.rank,
        data.teamName,
        record,
        changeData,
        data.points_for,
        data.points_against,
      ]);
      this.standingsTableBody.insertAdjacentHTML('beforeend', row);
    });
  }
}

export default new HomePageView();
