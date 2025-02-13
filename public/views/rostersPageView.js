import View from './view.js';

class RostersPageView extends View {
  constructor() {
    super();
  }

  /**
   * Render the rosters page
   * @param {JSON} rostersData JSON Data containing roster data for each team in the league
   */

  displayRosters(rostersData) {
    this.header.insertAdjacentHTML('afterend', this.generateContainers());
    const dataContainer = document.querySelector('.page-container');
    rostersData.forEach((teamRosterObj, index) => {
      dataContainer.insertAdjacentHTML(
        'beforeend',
        this.#generateTeamRosterTable(teamRosterObj.teamName, index)
      );
      const currentRosterTable = document.querySelector(
        'div.data-container:last-child table'
      );

      teamRosterObj.teamRoster.forEach((player) => {
        currentRosterTable
          .querySelector('tbody')
          .insertAdjacentHTML('beforeend', this.#generateTableRow(player));
      });
    });
  }

  /**
   * Generate the HTML String for a team's roster table
   * @param {String} teamName
   * @param {number} index Index of the forEach iteration that calls this function
   * @returns {String} HTML String of a team's roster table
   */

  #generateTeamRosterTable(teamName, index) {
    const tableHTML = `${
      index !== 0 ? '<div class="spacer"></div>' : ''
    }<div class="data-container"><table class="rosters-table">
      <thead>
        <tr>
          <th colspan="4" class="table-header">${teamName}</th>
        </tr>
        <tr>
          <th>Pos</th>
          <th>Player Name</th>
          <th>NFL Team</th>
          <th>Bye</th>
        </tr></thead><tbody></tbody></div>`;
    return `${tableHTML}`;
  }

  /**
   * Generate HTML String for a table row based on roster data about a player
   * @param {JSON} data JSON roster data about a player
   * @returns {String} HTML String for the table row containing the roster data
   */

  #generateTableRow(data) {
    return `<tr><td>${data.roster_position}</td><td>${data.player_name}</td><td>${data.nfl_team}</td><td>${data.bye_week}</td></tr>`;
  }

  /**
   * Add the loading icon to the rosters page
   */

  displayLoadingIcon() {
    const iconHTML = `<div class="rosters-spinner"><h3 class="loading-message">Loading Rosters...</h3>
                <img src="../img/loading.png" alt="test" class="loading-icon"></img>
              </div>`;
    this.header.insertAdjacentHTML('afterend', iconHTML);
  }
}

export default new RostersPageView();
