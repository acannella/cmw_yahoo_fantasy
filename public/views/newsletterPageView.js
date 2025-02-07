import View from './view.js';

class NewsletterPageView extends View {
  constructor() {
    super();
  }

  renderPage(newslettersCount, currNewsletter, handler) {
    const dropdown = this.#generateDropdown(newslettersCount);
    const newsletterFrame = this.#generateNewsletterFrame(currNewsletter);
    const newsletterHeader = this.#generateheader(newslettersCount);
    const containers = this.generateContainers();
    this.header.insertAdjacentHTML('afterend', containers);
    const pageContainer = document.querySelector('.page-container');
    pageContainer
      .querySelector('.data-container')
      .insertAdjacentHTML('beforeend', newsletterHeader + newsletterFrame);
    pageContainer.insertAdjacentHTML('beforeend', dropdown);

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
    return `<div class="newsletter-dropdown-container"><h3 class="newsletter-week-header">Week</h3><select class="newsletter-week-dropdown">${optionsString}</select></div>`;
  }
  #generateNewsletterFrame(newsletter) {
    return `<iframe src="${newsletter}" width="800" height="750" marginwidth="0"
 marginheight="0"></iframe>`;
  }

  #generateheader(number) {
    return `<div class="newsletter-header"><h2>Week ${number} Newsletter</h2></div>`;
  }
  renderNewsletter(weekNumber, newsletter) {
    const newsletterContainer = document.querySelector('.data-container');
    const newsletterHeader = this.#generateheader(weekNumber);
    const newsletterFrame = this.#generateNewsletterFrame(newsletter);

    this.clearDataContainer();
    newsletterContainer.insertAdjacentHTML(
      'beforeend',
      `${newsletterHeader}${newsletterFrame}`
    );
  }
}

export default new NewsletterPageView();
