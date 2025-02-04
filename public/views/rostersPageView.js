import View from './view.js';

class RostersPageView extends View {
  constructor() {
    super();
  }

  initRostersPage(handler) {
    handler();
  }

  displayRosters(rostersData) {
    let currTeam = this.header;
    rostersData.forEach((teamRosterObj) => {
      this.header.insertAdjacentHTML(
        'afterend',
        this.#generateTeamRosterTable(teamRosterObj.name)
      );
      const currentRosterTable = document.querySelector('.rosters-table');

      teamRosterObj.teamRoster.forEach((player) => {
        currentRosterTable
          .querySelector('tbody')
          .insertAdjacentHTML('beforeend', this.#generateTableRow(player));
      });
    });
  }
  #generateTeamRosterTable(name) {
    const tableHTML = `<table class="rosters-table">
      <thead>
        <tr>
          <th colspan="4">Roster</th>
        </tr>
        <tr>
          <th>Pos</th>
          <th>Player Name</th>
          <th>NFL Team</th>
          <th>Bye</th>
        </tr></thead><tbody></tbody>`;
    return `<h2>${name}</h2>${tableHTML}`;
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
