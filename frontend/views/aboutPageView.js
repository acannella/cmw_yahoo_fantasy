import View from './view.js';

class AboutPageView extends View {
  constructor() {
    super();
  }

  /**
   *
   * @param {Object} options Contains nav handler if it hasn't already been applied
   */
  renderAboutPage(options) {
    if (options.navHandler) super.addNavigationHandler(options.navHandler);
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
