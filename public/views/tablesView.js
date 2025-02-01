class TablesView {
  topScoringDropdown = document.querySelector('#top-scoring-dropdown');
  topScoringTableBody = document.querySelector(
    '#top-scoring-players-table tbody'
  );
  transactionsDropdown = document.querySelector('#transactions-dropdown');
  transactionsTableBody = document.querySelector('#transactions-table tbody');

  //Takes in the handler function from the controller so it can be executed by the view which has access to the dropdown value
  addHandlerTopScoringPageLoad(handler) {
    const topScoringDropdownValue = this.topScoringDropdown.value;
    document.addEventListener('DOMContentLoaded', function () {
      handler(+topScoringDropdownValue);
    });
  }

  addHandlerTransactionsPageLoad(handler) {
    const transactionsDropdownValue = this.transactionsDropdown.value;
    document.addEventListener('DOMContentLoaded', function () {
      handler(+transactionsDropdownValue);
    });
  }

  addHandlerTopScoringDropdown(handler) {
    const self = this;
    this.topScoringDropdown.addEventListener('change', function () {
      const topScoringDropdownValue = self.topScoringDropdown.value;
      self.topScoringTableBody.innerHTML = '';
      handler(+topScoringDropdownValue);
    });
  }

  addHandlerTransactionsDropdown(handler) {
    const self = this;
    this.transactionsDropdown.addEventListener('change', function () {
      const transactionsDropdownValue = self.transactionsDropdown.value;
      self.transactionsTableBody.innerHTML = '';
      handler(+transactionsDropdownValue);
    });
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
}

export default new TablesView();
