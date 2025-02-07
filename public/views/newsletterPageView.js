import View from './view.js';

class NewsletterPageView extends View {
  constructor() {
    super();
  }

  #generateContainers() {
    this.header.insertAdjacentHTML('afterend', super.generateContainers());
    const pageContainer = document.querySelector('.page-container');
    pageContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="data-container"></div>`
    );
  }

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
    const weekDropdown = document.querySelector('.newsletter-week-dropdown');
    weekDropdown.value = newslettersCount;
    weekDropdown.addEventListener('change', function () {
      handler(this.value);
    });
  }
  #generateDropdown(number) {
    let i = 1;
    let optionsString = '';
    while (i <= number) {
      optionsString += `<option value="${i}">${i}</option>`;

      i++;
    }
    return `<div class="dropdown-container"><h3 class="newsletter-week-header">Week</h3><select class="newsletter-week-dropdown">${optionsString}</select></div>`;
  }
  #generateNewsletterFrame(newsletter) {
    return `<iframe src="${newsletter}" width="800" height="750" marginwidth="0"
 marginheight="0"></iframe>`;
  }

  #generateheader(number) {
    return `<div class="newsletter-header"><h2>Week ${number} Newsletter</h2></div>`;
  }
  #clearDataContainer() {
    super.clearDataContainer();
    document.querySelector('.newsletter-header').remove();
  }

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
