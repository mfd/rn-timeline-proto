import baseForm from "./base-form";

export default class buyForm extends baseForm {
  constructor(modal) {
    super(modal, '.buy-form');

    this.$url = 'https://rn.digital/st/create_software_app';
  }

  fetchData() {
    const formData = new window.FormData(this.$form);
    formData.append('software', this.$form.dataset.software);

    console.log([...formData].map(el => el).join("\n "));

    this.submitButton.disabled = true;
    this.submitButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Отправка
    `;

    window.fetch(this.$url, { method: 'post', body: formData, })
      .then(res => res.json())
      .then(json => {
        debugger
        const { status } = json;
        console.log('fetch status →', status);

        if (status === 'success') {
          this.showSuccess();
          this.resetForm();
        } else {
          console.error(status);
        }

        this.submitButton.disabled = false;
        this.submitButton.innerHTML = this.submitButtonLabel;
      })
  }
}