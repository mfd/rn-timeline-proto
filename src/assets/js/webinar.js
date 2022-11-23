import webinarForm from './forms/_webinar-form'

class App {
  constructor() {
    $(this.ready.bind(this));
  }
  ready() {
    const webinarBtn = document.querySelector('.webinarRegBtn');

    if (webinarBtn) {
      const webinarRegModal = [...document.querySelectorAll('#webinarRegModal')];
      webinarRegModal.forEach(el => {
        new webinarForm(el);
      });
    }

  }
}

new App();
