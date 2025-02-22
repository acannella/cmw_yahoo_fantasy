import View from './view.js';

class RecordBookPageView extends View {
  constructor() {
    super();
  }

  /**
   * Render the league winners table
   * @param {Object} options Object containing JSON of record data and nav handler if it hasn't already been applied
   */

  renderRecordbookPage(options) {
    if (options.navHandler) super.addNavigationHandler(options.navHandler);
    this.header.insertAdjacentHTML('afterend', super.generateContainers());
    const pageContainer = document.querySelector('.page-container');
    pageContainer.insertAdjacentHTML(
      'beforeend',
      this.#generateRecordsTables()
    );
    const leagueWinnersTable = document.querySelector('.league-winners-table');
    options.recordData.leagueWinners.forEach((record) => {
      leagueWinnersTable
        .querySelector('tbody')
        .insertAdjacentHTML('beforeend', this.#generateLeagueWinnerRow(record));
    });

    const achievementsTable = document.querySelector('.achievements-table');
    options.recordData.otherRecords.forEach((record) => {
      achievementsTable
        .querySelector('tbody')
        .insertAdjacentHTML('beforeend', this.#generateAchievementRow(record));
    });
  }

  /**
   * Generate HTML String for the league winners table
   * @returns {String} HTML String for the league winners table
   */

  #generateRecordsTables() {
    const leagueWinnerHTML = `<div class="data-container">
    <table class="league-winners-table">
      <thead>
        <tr >
          <th colspan="3" class="table-header">League Winners</th>
        </tr>
        <tr>
          <th>Year</th>
          <th>Team Name</th>
          <th>Regular Season Record</th>
        </tr>
        </thead>
        <tbody></tbody>
     </table>   
        </div>`;

    const achievementsHTML = `<div class="spacer"></div><div class="data-container"><table class="achievements-table">
      <thead>
        <tr >
          <th colspan="4" class="table-header">Achievements</th>
        </tr>
        <tr>
          <th>Achievement</th>
          <th>Team Name</th>
          <th>Record</th>
          <th>Year</th>
        </tr></thead><tbody></tbody></div>`;
    return leagueWinnerHTML + achievementsHTML;
  }

  /**
   * Generate HTML String for a table row using the supplied record data
   * @param {JSON} data JSON containing record data
   * @returns {String} HTML String for the table row containing the record data
   */
  #generateLeagueWinnerRow(data) {
    return `<tr><td>${data.year}</td><td>${data.team_name}</td><td>${data.record_data}</td></tr>`;
  }

  #generateAchievementRow(data) {
    return `<tr><td>${data.record_name}</td><td>${data.team_name}</td><td>${data.record_data}</td><td>${data.year}</td></tr>`;
  }
}

export default new RecordBookPageView();
