import View from './view.js';

class AboutPageView extends View {
  constructor() {
    super();
  }

  renderAboutPage() {
    this.header.insertAdjacentHTML(
      'afterend',
      `<div></div><ul><li>Top Scoring Players in a given week</li>
      <li>Transactions for a given week</li>
      <li>Current Standings</li>
      <li>League Rosters</li>
      <li>League Record Book</li></ul>`
    );
  }
}

export default new AboutPageView();
