import buyForm from './forms/_buy-form'

class App {
  constructor() {
    $(this.ready.bind(this));
  }
  ready() {

    const isIE = false || !!document.documentMode;

    if (!isIE) {
        const bf = [...document.querySelectorAll('#buyFormModal')];
        const btnBuy = document.querySelector('.btn-buy');
        if(btnBuy) {
            console.log(btnBuy);
            document.querySelector('.btn-buy').classList.remove('hide');
            bf.forEach(form => {
              new buyForm(form);
            });
        }
    }
  }
}

new App();
