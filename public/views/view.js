export default class View {
  constructor() {
    this.navButtons = document.querySelectorAll('.nav-button');
    this.header = document.querySelector('header');
  }
  addNavigationHandler(handler) {
    const self = this;
    this.header.addEventListener('click', function (e) {
      //If click event occurs on button and it doesnt have the button selected class, update which button has that class and clean the html to prepare for rendering of new page
      if (
        e.target.tagName === 'BUTTON' &&
        !e.target.classList.contains('button-selected')
      ) {
        document
          .querySelector('.button-selected')
          .classList.remove('button-selected');
        e.target.classList.add('button-selected');
        self.clearHTML(self.header);

        handler(e.target.id);
      }
      //Listen for rosters_loaded event, this will remove the loading spinner and render the data
    });
    window.addEventListener('rosters_loaded', function () {
      const rostersSpinner = document.querySelector('.rosters-spinner');
      if (rostersSpinner) {
        handler('rosters-button');
      }
    });
  }
  clearHTML() {
    let elem = this.header.nextElementSibling;
    while (elem) {
      elem = elem.nextElementSibling;
      if (elem) elem.previousElementSibling.remove();
    }
  }
}
