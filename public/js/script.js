const topScoringDropdown = document.querySelector('#top-scoring-dropdown');
const topScoringTableBody = document.querySelector(
  '#top-scoring-players-table tbody'
);
const transactionsDropdown = document.querySelector('#transactions-dropdown');
const transactionsTableBody = document.querySelector(
  '#transactions-table tbody'
);

document.addEventListener('DOMContentLoaded', async function () {
  const topScoringCall = await fetch(
    `http://localhost:3000/topScoringPlayers?year=2024&weekStart=${topScoringDropdown.value}&weekEnd=${topScoringDropdown.value}`
  );

  const topScoringPlayersData = await topScoringCall.json();

  topScoringPlayersData.forEach((player) => {
    topScoringTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${player.playerRank}</td><td>${player.playerName}</td><td>${player.points}</td><td>${player.managerTeamName}</td></tr>`
    );
  });

  const transactionsCall = await fetch(
    `http://localhost:3000/transactions?week=${transactionsDropdown.value}`
  );

  //Clear out current table data
  transactionsTableBody.innerHTML = '';

  const transactionsData = await transactionsCall.json();

  transactionsData.forEach((transaction) => {
    let actionHTMLString;
    let playerHTMLString;
    let teamName;
    let teamNameHTMLString;
    const transactionDate = `${transaction.date}`;
    transaction.formattedTransactions.forEach((data, index) => {
      if (index < 1) {
        actionHTMLString = `${data.action}`;
        playerHTMLString = `${data.playerName}`;
        teamName = data.teamName;
        teamNameHTMLString = `${teamName}`;
      } else {
        actionHTMLString += `<div>${data.action}</div>`;
        playerHTMLString += `<div>${data.playerName}</div>`;
      }
    });
    transactionsTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${teamNameHTMLString}</td><td>${actionHTMLString}</td><td>${playerHTMLString}</td><td>${transactionDate}</td></tr>`
    );
  });
});

topScoringDropdown.addEventListener('change', async function () {
  const topScoringCall = await fetch(
    `http://localhost:3000/topScoringPlayers?year=2024&weekStart=${topScoringDropdown.value}&weekEnd=${topScoringDropdown.value}`
  );

  const topScoringPlayersData = await topScoringCall.json();
  //Clear out current table data
  topScoringTableBody.innerHTML = '';

  topScoringPlayersData.forEach((player) => {
    topScoringTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${player.playerRank}</td><td>${player.playerName}</td><td>${player.points}</td><td>${player.managerTeamName}</td></tr>`
    );
  });
});

transactionsDropdown.addEventListener('change', async function () {
  const transactionsCall = await fetch(
    `http://localhost:3000/transactions?week=${transactionsDropdown.value}`
  );

  const transactionsData = await transactionsCall.json();
  //Clear out current table data
  transactionsTableBody.innerHTML = '';

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
    transactionsTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${teamNameHTMLString}</td><td>${actionHTMLString}</td><td>${playerHTMLString}</td><td>${transactionDate}</td></tr>`
    );
  });
});
