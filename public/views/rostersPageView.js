import View from './view.js';

class RostersPageView extends View {
  constructor() {
    super();
  }

  displayRosters(rostersData) {
    this.header.insertAdjacentHTML('afterend', this.generateContainers());
    const dataContainer = document.querySelector('.page-container');
    rostersData.forEach((teamRosterObj, index) => {
      dataContainer.insertAdjacentHTML(
        'beforeend',
        this.#generateTeamRosterTable(teamRosterObj.name, index)
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
  #generateTeamRosterTable(name, index) {
    const tableHTML = `${
      index !== 0 ? '<div class="spacer"></div>' : ''
    }<div class="data-container"><table class="rosters-table">
      <thead>
        <tr>
          <th colspan="4" class="table-header">${name}</th>
        </tr>
        <tr>
          <th>Pos</th>
          <th>Player Name</th>
          <th>NFL Team</th>
          <th>Bye</th>
        </tr></thead><tbody></tbody></div>`;
    return `${tableHTML}`;
  }

  #generateTableRow(data) {
    return `<tr><td>${data.selected_position}</td><td>${data.name}</td><td>${data.nfl_team_abbr}</td><td>${data.bye_week}</td></tr>`;
  }

  displayLoadingIcon() {
    const iconHTML = `<div class="rosters-spinner"><h3 class="loading-message">Loading Rosters...</h3>
                <img src="../img/loading.png" alt="test" class="loading-icon"></img>
              </div>`;
    this.header.insertAdjacentHTML('afterend', iconHTML);
  }
}

export default new RostersPageView();
