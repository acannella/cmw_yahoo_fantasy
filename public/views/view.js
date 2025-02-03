export default class View {
  constructor() {
    this.navButtons = document.querySelectorAll('.nav-button');
    this.header = document.querySelector('header');
  }
  addNavigationHandler(handler) {
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

        let elem = this.nextElementSibling;
        while (elem) {
          elem = elem.nextElementSibling;
          if (elem) elem.previousElementSibling.remove();
        }

        handler(e.target.id);
      }
    });
  }
}
