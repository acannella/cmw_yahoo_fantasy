import View from './view.js';

class NewsletterPageView extends View {
  constructor() {
    super();
  }

  renderPage(newslettersCount, currNewsletter, handler) {
    const dropdown = this.#generateDropdown(newslettersCount);
    const newsletterFrame = this.#generateNewsletterFrame(currNewsletter);
    const newsletterHeader = this.#generateheader(newslettersCount);
    this.header.insertAdjacentHTML(
      'afterend',
      `<div class="newsletter-page-container"><div class="newsletter-container">${newsletterHeader}${newsletterFrame}</div><div class="newsletter-dropdown-container">${dropdown}</div></div>`
    );
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
    return `<h3 class="newsletter-week-header">Week</h3><select class="newsletter-week-dropdown">${optionsString}</select>`;
  }
  #generateNewsletterFrame(newsletter) {
    return `<iframe src="${newsletter}" width="800" height="750" marginwidth="0"
 marginheight="0"></iframe>`;
  }

  #generateheader(number) {
    return `<div class="spacer"></div><div class="newsletter-header"><h2>Week ${number} Newsletter</h2></div>`;
  }
  renderNewsletter(weekNumber, newsletter) {
    const newsletterContainer = document.querySelector('.newsletter-container');
    const newsletterHeader = this.#generateheader(weekNumber);
    const newsletterFrame = this.#generateNewsletterFrame(newsletter);

    newsletterContainer.innerHTML = '';
    newsletterContainer.insertAdjacentHTML(
      'afterbegin',
      `${newsletterHeader}${newsletterFrame}`
    );
  }
}

export default new NewsletterPageView();
