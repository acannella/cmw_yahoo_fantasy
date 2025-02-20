import View from './view.js';

class NewsletterPageView extends View {
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
   * Render newsletters page with the newsletter from the most recent week
   * @param {Object} options Object that contains the newsletterCount, currNewsletter and nav handler if it hasn't already been applied
   */

  renderPage(options) {
    if (options.navHandler) super.addNavigationHandler(options.navHandler);
    this.#generateContainers();
    const dropdown = this.#generateDropdown(options.newslettersCount);
    const newsletterFrame = this.#generateNewsletterFrame(
      options.currNewsletter
    );
    const newsletterHeader = this.#generateheader(options.newslettersCount);
    const pageContainer = document.querySelector('.page-container');
    pageContainer.insertAdjacentHTML('afterbegin', newsletterHeader);
    pageContainer
      .querySelector('.data-container')
      .insertAdjacentHTML('afterbegin', newsletterFrame + dropdown);
    const weekDropdown = document.querySelector('.week-dropdown');
    weekDropdown.value = options.newslettersCount;
    weekDropdown.addEventListener('change', function () {
      options.newsletterHandler(this.value);
    });
  }

  /**
   * Generate HTML String of dropdown container, dropdown, header, and dropdown options
   * @param {number} newsletterCount number of newsletters, used to populate the number of dropdown options
   * @returns {String} HTML string of the dropdown container
   */

  #generateDropdown(newsletterCount) {
    let i = 1;
    let optionsString = '';
    while (i <= newsletterCount) {
      optionsString += `<option value="${i}">${i}</option>`;

      i++;
    }
    return `<div class="dropdown-container"><h3 class="dropdown-week-header">Week</h3><select class="week-dropdown">${optionsString}</select></div>`;
  }

  /**
   * Generate HTML string of the iframe used to render the newsletter
   * @param {String} newsletter String containing the URL to the newsletter in Google Docs
   * @returns {String} HTML string of the iframe with the newsletter URL as the src
   */

  #generateNewsletterFrame(newsletter) {
    return `<iframe src="${newsletter}" width="800" height="750" marginwidth="0"
 marginheight="0"></iframe>`;
  }

  /**
   * Generate HTMl String for the header
   * @param {number} weekNumber Number that will be in the header
   * @returns HTML String with the newsletter-header data
   */

  #generateheader(weekNumber) {
    return `<div class="newsletter-header"><h2>Week ${weekNumber} Newsletter</h2></div>`;
  }

  /**
   * Remove newsletter iFrame and header
   */

  #clearNewsletter() {
    let elem = document.querySelector('.data-container');
    while (
      elem.hasChildNodes() &&
      !elem.firstElementChild.classList.contains('dropdown-container')
    ) {
      elem.firstElementChild.remove();
    }
    document.querySelector('.newsletter-header').remove();
  }

  /**
   * Render a different newsletter than what is rendered when the page is first loaded
   * @param {number} weekNumber Week number of the newsletter to be rendered
   * @param {String} newsletter String containing the URL to the newsletter to be rendered
   */

  renderNewsletter(weekNumber, newsletter) {
    const pageContainer = document.querySelector('.page-container');
    const newsletterHeader = this.#generateheader(weekNumber);
    const newsletterFrame = this.#generateNewsletterFrame(newsletter);

    this.#clearNewsletter();
    pageContainer.insertAdjacentHTML('afterbegin', newsletterHeader);
    pageContainer
      .querySelector('.data-container')
      .insertAdjacentHTML('afterbegin', newsletterFrame);
  }
}

export default new NewsletterPageView();
