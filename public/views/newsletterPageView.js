import View from './view.js';

class NewsletterPageView extends View {
  constructor() {
    super();
  }

  renderPage() {
    this.header.insertAdjacentHTML(
      'afterend',
      `<div class="doc-container"><h2>Week 15 Newsletter</h2><iframe src="https://docs.google.com/document/d/e/2PACX-1vTD91Uf2HabV71W6ASaSn-lw4VI1t3KSjWW8xHzIBsHq0jLohaB7yc0zlP7sqAsMYHRwQ_n8NZLibFm/pub?embedded=true" width="750" height="750" marginwidth="0"
 marginheight="0"></iframe></div>`
    );
  }
}

export default new NewsletterPageView();
