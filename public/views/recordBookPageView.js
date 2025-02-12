import View from './view.js';

class RecordBookPageView extends View {
  constructor() {
    super();
  }

  /**
   * Insert data-container div after the page-container div that is generated from the super class
   */

  #generateContainers() {
    this.header.insertAdjacentHTML('afterend', super.generateContainers());
    const pageContainer = document.querySelector('.page-container');
    pageContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="data-container"></div>`
    );
  }

  /**
   * Render the league winners table
   * @param {JSON} recordData JSON of records data
   */

  displayRecords(recordData) {
    this.#generateContainers();
    const dataContainer = document.querySelector('.data-container');
    dataContainer.insertAdjacentHTML(
      'beforeend',
      this.#generateLeagueWinnersTable()
    );
    const leagueWinnersTable = document.querySelector('.league-winners-table');
    recordData.forEach((record) => {
      leagueWinnersTable
        .querySelector('tbody')
        .insertAdjacentHTML('beforeend', this.#generateTableRow(record));
    });
  }

  /**
   * Generate HTML String for the league winners table
   * @returns {String} HTML String for the league winners table
   */

  #generateLeagueWinnersTable() {
    const tableHTML = `<table class="league-winners-table">
      <thead>
        <tr >
          <th colspan="3" class="table-header">League Winners</th>
        </tr>
        <tr>
          <th>Year</th>
          <th>Team Name</th>
          <th>Regular Season Record</th>
        </tr></thead><tbody></tbody>`;
    return tableHTML;
  }

  /**
   * Generate HTML String for a table row using the supplied record data
   * @param {JSON} data JSON containing record data
   * @returns {String} HTML String for the table row containing the record data
   */
  #generateTableRow(data) {
    return `<tr><td>${data.year}</td><td>${data.team_name}</td><td>${data.record_data}</td></tr>`;
  }
}

export default new RecordBookPageView();
