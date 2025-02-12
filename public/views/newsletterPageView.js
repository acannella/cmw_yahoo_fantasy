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
   * @param {number} newslettersCount Number of newsletters in the database
   * @param {String} currNewsletter String of the URL to the newsletter in Google Docs
   * @param {function} handler function called whenever the newsletter dropdown is changed
   */

  renderPage(newslettersCount, currNewsletter, handler) {
    this.#generateContainers();
    const dropdown = this.#generateDropdown(newslettersCount);
    const newsletterFrame = this.#generateNewsletterFrame(currNewsletter);
    const newsletterHeader = this.#generateheader(newslettersCount);
    const pageContainer = document.querySelector('.page-container');
    pageContainer.insertAdjacentHTML('afterbegin', newsletterHeader);
    pageContainer
      .querySelector('.data-container')
      .insertAdjacentHTML('afterbegin', newsletterFrame + dropdown);
    const weekDropdown = document.querySelector('.week-dropdown');
    weekDropdown.value = newslettersCount;
    weekDropdown.addEventListener('change', function () {
      handler(this.value);
    });
  }

  /**
   * Generate HTML String of dropdown container, dropdown, header, and dropdown options
   * @param {number} number number of newsletters, used to populate the number of dropdown options
   * @returns {String} HTML string of the dropdown container
   */

  #generateDropdown(number) {
    let i = 1;
    let optionsString = '';
    while (i <= number) {
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
   * @param {number} number Number that will be in the header
   * @returns HTML String with the newsletter-header data
   */

  #generateheader(number) {
    return `<div class="newsletter-header"><h2>Week ${number} Newsletter</h2></div>`;
  }

  /**
   * Remove the newsletter-header along with clearing other container data
   */

  #clearDataContainer() {
    super.clearDataContainer();
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

    this.#clearDataContainer();
    pageContainer.insertAdjacentHTML('afterbegin', newsletterHeader);
    pageContainer
      .querySelector('.data-container')
      .insertAdjacentHTML('afterbegin', newsletterFrame);
  }
}

export default new NewsletterPageView();
