import View from './view.js';

class HomePageView extends View {
  constructor() {
    super();
    this.basePageHTML = [];
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

  #setDropdownHandlers() {
    const self = this;
    this.topScoringDropdown.addEventListener('change', function () {
      const topScoringDropdownValue = self.topScoringDropdown.value;
      self.topScoringTableBody.innerHTML = '';
      self.homePageHandlers[0](+topScoringDropdownValue);
    });
    this.transactionsDropdown.addEventListener('change', function () {
      const transactionsDropdownValue = self.transactionsDropdown.value;
      self.transactionsTableBody.innerHTML = '';
      self.homePageHandlers[1](+transactionsDropdownValue);
    });
  }

  rebuildHomePage() {
    let currnode = this.header;
    this.basePageHTML.forEach((element) => {
      currnode.insertAdjacentHTML('afterend', element);
      currnode = currnode.nextElementSibling;
    });
    this.initHomePage();
  }

  //Take in the 4 handlers for page load: loading topscoring players, transactions, and standings, nav handler
  initHomePage(handlers) {
    if (handlers) this.homePageHandlers = handlers;
    this.#setPageElements();
    this.#setDropdownHandlers();
    super.addNavigationHandler(this.homePageHandlers[3]);
    const topScoringDropdownValue = this.topScoringDropdown.value;
    const transactionsDropdownValue = this.transactionsDropdown.value;

    if (this.basePageHTML.length < 1) {
      //Store the html of the homepage before adding data to it
      let elem = this.header.nextElementSibling;
      while (elem) {
        if (elem.nodeName !== 'SCRIPT')
          this.basePageHTML.push(elem.outerHTML.toString());
        elem = elem.nextElementSibling;
      }
    }

    this.homePageHandlers[0](+topScoringDropdownValue);
    this.homePageHandlers[1](+transactionsDropdownValue);
    this.homePageHandlers[2]();
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
