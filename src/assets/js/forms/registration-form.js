import baseForm from "./base-form";

export default class registrationForm extends baseForm {
  constructor(modal, endpointName) {
    super(modal, '.registration-form');

    this.$url = `https://robotics-hackathon-2021.rn.digital/${endpointName}`;
  }

  fetchData() {
    const formData = new window.FormData(this.$form);

    this.submitButton.disabled = true;
    this.submitButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Отправка
    `;

    window.fetch(this.$url, { method: 'post', body: formData })
      .then(res => res.json())
      .then(json => {
        const { status } = json;
        console.log('fetch status →', status);

        if (status === 'success') {
          this.showSuccess();
          this.resetForm();
        } else {
          console.error(status);
        }

        this.buttonNormalize();
      })
      .catch(error => {
        console.log(error);
        this.buttonNormalize();
        this.showSendError();
      })
  }

  buttonNormalize() {
    this.submitButton.disabled = false;
    this.submitButton.innerHTML = this.submitButtonLabel;
  }
}