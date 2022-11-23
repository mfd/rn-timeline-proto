export default class baseForm {
  constructor(modal, formSelector) {
    this.$modal = modal;
    this.$form = this.$modal.querySelector(formSelector);
    this.$formInputs = this.$form.querySelectorAll('[required]');
    this.submitButton = this.$form.querySelector('input[type="submit"], button[type="submit"]');
    this.submitButtonLabel = this.submitButton.textContent;

    this.$form.addEventListener('input', e => e.target.classList.add("has-input"), true);
    this.$form.addEventListener('blur', () => this.validateForm(this.$form), true);

    this.$form.addEventListener('submit', this.onSubmit.bind(this));
    $(this.$modal).on('hidden.bs.modal', this.resetForm.bind(this));
  }

  onSubmit(e) {
    e.preventDefault();

    [...this.$form.querySelectorAll("input,textarea")].forEach(field => field.classList.add("has-input"));

    if (this.validateForm(this.$form, true)) {
      this.fetchData()
    } else {
      this.$modal.classList.add('errorShake');
      this.$modal.onanimationend = e => e.target.classList.remove('errorShake');
    }
  }

  fetchData() {
    //override
  }

  validateForm(form, all = false) {
    let selector = '.has-input';
    let errorCount = 0;

    if (all) {
      selector = 'input, textarea';
    }

    const fields = [...form.querySelectorAll(selector)];

    this.clearErrors(form);

    fields.forEach(field => {
      if (field.required && field.value.trim() === '') {
        if (field.classList.contains('js-select-field')) {
          const select = field.closest('.js-select');
          this.showError(select, `Не выбрано`);
        } else {
          this.showError(field, field.dataset.errormess);
        }

        errorCount++;
        return;
      }

      if (field.type === 'email' && !this.isEmail(field.value)) {
        this.showError(field, field.dataset.errormess);

        errorCount++;
      }

      if (field.type === 'checkbox' && !field.checked) {
        this.showError(field);

        errorCount++;
      }
    });

    return (!errorCount);
  }

  closeModal() {
    $(this.$modal).modal('hide');

    this.resetForm();
  }

  showError(input, message) {
    if (message) {
      const error = document.createElement('div');
      error.classList.add('invalid-feedback');
      error.textContent = message;
      input.parentNode.insertBefore(error, input.nextSibling);
    }

    input.classList.add('is-invalid');
  }

  clearErrors() {
    const errors = [...this.$form.querySelectorAll('.invalid-feedback')];
    errors.forEach(error => error.parentNode.removeChild(error));

    const inputs = [...this.$form.querySelectorAll('[required]')];
    inputs.forEach(input => input.classList.remove('is-invalid'));
  }

  resetForm() {
    this.clearErrors();
    this.$form.reset();
  }

  showSuccess() {
    const successEl = document.createElement('div');
    successEl.classList.add('alert', 'alert-success');
    successEl.innerHTML = this.$form.dataset.success;

    this.$form.parentNode.insertBefore(successEl, this.$form);

    setTimeout(() => {
      successEl.parentNode.removeChild(successEl);
      this.closeModal();
    }, 2000);
  }

  showSendError() {
    const errorElement = document.createElement('div');
    errorElement.classList.add('alert', 'alert-danger');
    errorElement.innerHTML = this.$form.dataset.error;

    this.$form.parentNode.insertBefore(errorElement, this.$form);

    setTimeout(() => {
      errorElement.parentNode.removeChild(errorElement);
    }, 2000);
  }

  isEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  isTel(tel) {
    // https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
    let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    return re.test(tel);
  }
}
