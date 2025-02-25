export default class View {
  constructor() {
    this.navButtons = document.querySelectorAll('.nav-button');
    this.header = document.querySelector('header');
  }

  /**
   * Add actionListeners to the header and the window
   * @param {function} handler function to be executed when a nav button is clicked
   */

  addNavigationHandler(handler) {
    const self = this;
    this.header.addEventListener('click', function (e) {
      if (
        e.target.tagName === 'BUTTON' &&
        !e.target.classList.contains('button-selected')
      ) {
        document
          .querySelector('.button-selected')
          ?.classList.remove('button-selected');
        e.target.classList.add('button-selected');
        self.clearPageHTML();

        handler(e.target.id);
      }
    });
  }

  /**
   * Generate HTML String which will be used as the base for views
   * @returns {String} HTML String for the base of the page
   */

  generateContainers() {
    return `<div class="spacer"></div><div class="page-container"></div>`;
  }

  /**
   * Clear all html below the header
   */

  clearPageHTML() {
    let elem = this.header.nextElementSibling;
    while (elem) {
      elem = elem.nextElementSibling;
      if (elem) elem.previousElementSibling.remove();
    }
  }

  renderError() {
    const message =
      'There was an error loading the page, please try again later.';
    const errorElement = `<div class="spacer"></div><div class="page-container"><div class="error-container">${message}</div></div>`;
    this.header.insertAdjacentHTML('afterend', errorElement);
  }

  displayLoadingIcon() {
    const iconHTML = `<div class="rosters-spinner"><h3 class="loading-message">Loading Rosters...</h3>
                <img src="../img/loading.png" alt="test" class="loading-icon"></img>
              </div>`;
    this.header.insertAdjacentHTML('afterend', iconHTML);
  }
}
