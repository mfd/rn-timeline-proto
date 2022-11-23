import registrationForm from "./registration-form";

export default class registrationModal {
  constructor(modalId) {
    this.$modalId = modalId;
    this.$modal = document.querySelector(modalId);
    this.$modalRegistration = this.$modal.querySelector('.modal-registration');
    this.$formContainer = this.$modal.querySelector('.form-container');
    this.$team = this.$modal.querySelector('.registration-button__btn--team');
    this.$alone = this.$modal.querySelector('.registration-button__btn--alone');

    this.createEventListeners();
  }

  createEventListeners() {
    this.$team.addEventListener('click', this.goToTeamRegistration.bind(this));
    this.$alone.addEventListener('click', this.goToAloneRegistration.bind(this));
    $(this.$modalId).on('hidden.bs.modal', this.hideModal.bind(this));
    $(this.$modalId).on('show.bs.modal', this.showModal.bind(this));
  }

  destroy() {
    this.$team.removeEventListener('click', this.goToTeamRegistration);
    this.$alone.removeEventListener('click', this.goToAloneRegistration);
  }

  showModal() {
    this.$modalRegistration.classList.remove('hide');
  }

  hideModal() {
    this.$formContainer.innerHTML = '';
  }

  back() {
    this.$formContainer.innerHTML = '';
    this.$modalRegistration.classList.remove('hide');
  }

  goToTeamRegistration() {
    this.$formContainer.innerHTML = document.querySelector('#teamRegistrationForm').innerHTML;
    this.$teamCount = document.querySelector("#teamcount");
    this.$teamCount.addEventListener('change', this.recreateUsersFields.bind(this));

    this.recreateUsersFields();
    this.goToRegistration('team');
  }

  goToAloneRegistration() {
    this.$formContainer.innerHTML = document.querySelector('#aloneRegistrationForm').innerHTML;
    this.goToRegistration('user');

    this.phoneMask();
  }

  goToRegistration(endpointName) {
    this.$modalRegistration.classList.add('hide');
    this.$backButton = document.querySelector(".back-button");
    this.$backButton.addEventListener('click', this.back.bind(this));

    this.$registrationForm = new registrationForm(this.$modal, endpointName);
  }

  recreateUsersFields() {
    const count = document.getElementById("teamcount").value;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count - 1; i++) {
      fragment.append(this.createUserFields(i));
    }

    const userContainer = this.$formContainer.querySelector('.user-container');
    userContainer.innerHTML = '';
    userContainer.append(fragment);

    this.phoneMask();
  }

  createUserFields(num) {
    const row = document.createElement('div');
    row.classList.add("form-group", "d-flex", "col-md-12", "px-md-1", "user-fields");

    const index = num + 2;

    row.appendChild(this.createUserField({ id: `fio${index}`, name: `fio${index}`, placeholder: `ФИО №${index}` }));
    row.appendChild(this.createUserField({ id: `email${index}`, name: `email${index}`, placeholder: 'Почта', error: 'Некорректный e-mail', fieldType: 'email' }));
    row.appendChild(this.createUserField({ id: `phone${index}`, name: `phone${index}`, placeholder: 'Телефон', fieldType: 'tel' }));
    row.appendChild(this.createUserField({ id: `university${index}`, name: `university${index}`, placeholder: 'ВУЗ' }));
    row.appendChild(this.createUserField({ id: `group${index}`, name: `group${index}`, placeholder: 'Группа' }));

    return row;
  }

  createUserField({ id, name, placeholder, error, fieldType }) {
    const userField = document.createElement('div');
    userField.classList.add("user-field");

    const input = this.createInput({ id, name, placeholder, fieldType, error });
    userField.appendChild(input);

    return userField;
  }

  createInput({ id, name, placeholder = "", error = "Не заполнено", fieldType = "text" }) {
    const input = document.createElement('input');
    input.classList.add("form-control", "form-control-sm", "mr-1", "text-input");
    input.id = id;
    input.name = name;
    input.placeholder = placeholder;
    input.dataset.errormess = error;
    input.required = true;
    input.type = fieldType;

    return input;
  }

  phoneMask() {
    $('[type="tel"]').inputmask({
      "mask": [
        "+7 (999) 999-99-99",  // Россия
        "+380 (99) 999-99-99", // Украина
        "+375 (99) 999-99-99", // Белоруссия
        "+\\9\\99 (999) 999-999[9]", // Азербайджан, Грузия, Узбекистан
        "+379 (99) 999-999[9]", // Молдова, Латвия, Литва
      ],
      "clearIncomplete": true,
      autoUnmask: false,
      removeMaskOnSubmit: false,
    });
  }

}