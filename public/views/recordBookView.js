import View from './view.js';

class RecordBookPageView extends View {
  constructor() {
    super();
  }

  displayRecords(recordData) {
    this.header.insertAdjacentHTML(
      'afterend',
      this.#generateLeagueWinnersTable()
    );
    const leagueWinnersTable = document.querySelector('.league-winners-table');
    recordData.forEach((record) => {
      leagueWinnersTable
        .querySelector('tbody')
        .insertAdjacentHTML('beforeend', this.#generateTableRow(record));
    });
  }
  #generateLeagueWinnersTable() {
    const tableHTML = `<table class="league-winners-table">
      <thead>
        <tr>
          <th colspan="3">League Winners</th>
        </tr>
        <tr>
          <th>Year</th>
          <th>Team Name</th>
          <th>Regular Season Record</th>
        </tr></thead><tbody></tbody>`;
    return tableHTML;
  }

  #generateTableRow(data) {
    return `<tr><td>${data.year}</td><td>${data.team_name}</td><td>${data.record_data}</td></tr>`;
  }
}

export default new RecordBookPageView();
