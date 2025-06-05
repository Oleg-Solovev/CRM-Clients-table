
import * as components from "./components.js"
import { downloadFromLS, checkLS, getFromLS } from "./localStorageBase.js"
import { debounce } from "./filters.js"

// Подключение библиотеки jQuery
$(document).ready()



// Функция создания модальных окон
function createModal(typeModal, clientObj = {}) {

  // Общие элементы для всех модальных окон
  const modalParent = components.createEl('div', 'modal__parent');
  const modalFormWrapper = components.createEl('form', 'form');
  modalFormWrapper.autocomplete = 'off';
  const btnModalReset = components.createEl('button', 'btn-modal-reset');
  const modalTitle = components.createEl('h2', 'modal__title');
  if (typeModal === 'Удалить клиента') {
    modalTitle.classList.add('modal__title--delate');
  }
  const modalTitleSpan = components.createEl('span', 'modal__title-bold', typeModal);
  modalTitle.append(modalTitleSpan);

  const formBtnBox = components.createEl('div', 'form__btn-box');
  const cancelBtn = components.createEl('button', 'cancel-btn', 'Отмена');
  modalFormWrapper.append(btnModalReset, modalTitle);
  modalParent.append(modalFormWrapper);
  modalSpace.append(modalParent);

  // закрытие всех модальных окон
  $(cancelBtn).on('click', function () {
    return $('#modalSpace').empty();
  });
  $(btnModalReset).on("click", function () {
    return $('#modalSpace').empty();
  })
  $(document).on("keydown", function (event) {
    if (event.key === "Escape")
      return $('#modalSpace').empty();
  });

  // Общие элементы для модальных окон: Новый клиент и Изменить данные
  if (typeModal === 'Новый клиент' || typeModal === 'Изменить данные') {

    const modalForm = components.createEl('div', 'form__input-wapper');
    const surnameInput = components.createInput('surname', 'Фамилия');
    const nameInput = components.createInput('name', 'Имя');
    const lastNameInput = components.createInput('lastName', 'Отчество');
    const formAddContact = components.createEl('div', 'form__add-contact');
    const formAddContactWrapp = components.createEl('div', 'form__add-contact-wrapp');
    const btnAddContact = components.createEl('button', 'add-contact-btn', 'Добавить контакт');
    const saveClientBtn = components.createEl('button', 'client-btn', 'Сохранить');
    saveClientBtn.classList.add('client-btn-save');
    saveClientBtn.type = 'submit';
    modalForm.append(surnameInput, nameInput, lastNameInput);
    formAddContact.append(formAddContactWrapp, btnAddContact);
    modalFormWrapper.append(modalForm, formAddContact, formBtnBox);

    if (typeModal === 'Изменить данные') {
      contactCounter = clientObj.contacts.length;
    } else {
      contactCounter = 0;
    }

    // добавление новой строки контакта
    $('.add-contact-btn').on("click", async e => {
      e.preventDefault();
      ++contactCounter;
      if (contactCounter > 9) {
        btnAddContact.classList.add('visually-hidden');
      } else {
        if (btnAddContact.classList.contains('visually-hidden')) {
          $('btnAddContact').removeClass('visually-hidden');
        }
        formAddContactWrapp.append(getNewContact());
      }
    })

    // Кнопка сохранения данных и создания объекта клиента
    $(saveClientBtn).on("click", async e => {
      e.preventDefault();
      if (validationForm(modalForm)) {
        const contacts = [];
        const contactType = document.querySelectorAll('.js-choice');
        const contactValue = document.querySelectorAll('.input-contact');

        for (let i = 0; i < contactType.length; i++) {
          contacts.push({
            type: contactType[i].value,
            value: contactValue[i].value
          })
        }

        const newClient = {
          id: Math.round(Math.random() * 1000),
          name: nameInput.querySelector('.form__input').value.trim(),
          surname: surnameInput.querySelector('.form__input').value.trim(),
          lastName: lastNameInput.querySelector('.form__input').value.trim(),
          createdAt: new Date(),
          updatedAt: new Date(),
          contacts: contacts,
        };

        // Добавляем нового клиента на сервер или изменяем существующего
        if (typeModal === 'Новый клиент') {
          getFromLS(newClient);
        } else {
          if (typeModal === 'Изменить данные') {
            getFromLS(newClient, clientObj.id);
          }
        };

        // при положительном запросе отрисовка таблицы клиентов
        let clientsArr = downloadFromLS('clientsArr');
        if (clientsArr.length !== 0) {
          $('#modalSpace').empty();
          renderClientsList(clientsArr);
        }
      }
    })

    // Для модального окна "Новый клиент"
    if (typeModal === 'Новый клиент') {
      formBtnBox.append(saveClientBtn, cancelBtn);
      return modalParent
    }

    // Для модального окна "Изменить данные"
    if (typeModal === 'Изменить данные') {
      const deleteChangeBtn = components.createEl('button', 'delete-btn', 'Удалить клиента');
      formBtnBox.append(saveClientBtn, deleteChangeBtn);
      const titleID = components.createEl('span', 'table-text', `ID: ${clientObj.id}`);
      titleID.classList.add('span-text');
      modalTitle.append(titleID);

      surnameInput.querySelector('.form__input').value = clientObj.surname;
      nameInput.querySelector('.form__input').value = clientObj.name;
      lastNameInput.querySelector('.form__input').value = clientObj.lastName;

      // Отрисовка списка контактов и заполнение полей
      clientObj.contacts.forEach((el) => {
        formAddContactWrapp.append(getNewContact(el));
      })

      // Вызов модального окна 'Удалить клиента'
      $('.delete-btn').on("click", function (e) {
        e.preventDefault();
        modalSpace.append(createModal('Удалить клиента', clientObj));
      })
      return modalParent
    }
  }

  // Для модального окна Удалить клиента
  if (typeModal === 'Удалить клиента') {
    modalTitle.classList.add('modal__title--delate');
    const textMassage = components.createEl('p', 'text-massage', 'Вы действительно хотите удалить данного клиента?');
    const deleteBtn = components.createEl('button', 'client-btn', 'Удалить');
    formBtnBox.append(deleteBtn, cancelBtn);
    modalFormWrapper.append(textMassage, formBtnBox);

    // удаление клиента из базы LS
    $('.client-btn').on("click", e => {
      e.preventDefault();
      $('#modalSpace').empty();
      getFromLS('', clientObj.id);
      clientsList = downloadFromLS('clientsArr');
      renderClientsList(clientsList);
    });
    return modalParent
  }
}


// Функция, возвращая новый контакт
function getNewContact(obj = {}) {
  // Массив типов контактов
  const contactsTypeArr = [
    {
      text: "Телефон",
      value: "phone"
    },
    {
      text: "Email",
      value: "mail"
    },
    {
      text: "Вконтакте",
      value: "vk"
    },
    {
      text: "Телеграм",
      value: "tg"
    },
    {
      text: "Фейсбук",
      value: "fb"
    },
  ]

  // бокс с контактом
  const newContact = components.createEl('div', 'contacts');

  // создание селекта
  const selectWrapper = components.createEl('div', 'select-wrapper');
  const select = components.createEl('select', 'js-choice');

  select.onclick = function () {
    selectWrapper.classList.toggle('is-open');
  }

  contactsTypeArr.forEach((el) => {
    const option = components.createEl('option', 'option-contact', el.text);
    option.value = el.value;
    select.append(option);
  })
  selectWrapper.append(select);
  const selectText = contactsTypeArr.find(el => el.value === obj.type).text
  console.log(selectText)

  // создание инпута
  const input = components.createEl('input', 'input-contact');
  input.type = "text";
  obj.value ? input.value = obj.value : input.placeholder = 'Введите данные контакта';

  const deleteContactBtn = components.createEl('button', 'delete-contact-btn');
  $(deleteContactBtn).attr("tooltip", "Удалить контакт");
  newContact.append(selectWrapper, input, deleteContactBtn)

  // инициализация библиотеки choices
  const choice = new Choices(select, {
    searchEnabled: false,
    // itemSelectText: selectText,
    itemSelectText: '',
    shouldSort: false,
    allowHTML: true,
  });


  // удаление строки контакта
  deleteContactBtn.onclick = function () {
    --contactCounter;

    if (contactCounter < 10) {
      // const btnAddContact = document.querySelector('.add-contact-btn');
      const btnAddContact = $('.add-contact-btn');

      if (btnAddContact.classList.contains('visually-hidden')) {
        $('.btnAddContact').removeClass('.visually-hidden');
      }
      newContact.remove();
    }
  }
  return newContact
}


// Функция валидации формы
function validationForm(form) {

  // Текст ошибки
  function createError(input, text) {
    // Получить родителя элемента (parentNode)
    const parent = input.parentNode;
    const errorLabel = components.createEl('label', 'error-label', text);
    parent.classList.add('error');
    parent.append(errorLabel);
  }

  // удаление текста ошибки
  function removeError(input) {
    const parent = input.parentNode;
    if (parent.classList.contains('error')) {
      parent.querySelector('.error-label').remove();
      $('parent').removeClass('error');
    }
  }

  let accept = true;

  // Проверка текстовых полей
  const allInputs = form.querySelectorAll('.form__input');
  for (const input of allInputs) {
    let text = input.value.trim();
    removeError(input);
    if (text.length < 3) {
      createError(input, 'Должно быть не менее 3 символов!');
      accept = false;
    }
    // Делаю первые буквы данных заглавными, остальные строчными
    input.value = text.substr(0, 1).toUpperCase() + text.substr(1).toLowerCase();
  }

  // Проверка полей контактов
  const allInputsContacts = modalSpace.querySelectorAll('.input-contact');
  for (const input of allInputsContacts) {
    const text = input.value.trim();
    // let text = input.value.trim();
    removeError(input);
    if (text.length < 3) {
      createError(input, 'Должно быть не менее 3 символов!');
      accept = false;
    }
  }
  return accept
}


// Функция вывода одного пользователя в таблицу 
function createClientItem(clientObj) {

  const clientTr = components.createEl('tr');
  const idTd = components.createEl('td', 'table-text', clientObj.id);
  const fulNameTd = components.createEl('td', 'table__cell', `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`);
  //  сделать отдельную функцию для createdAtTd и updatedAtTd как двух типов
  const createdAtTd = components.createEl('td');
  const createdAtTdDate = components.createEl('span', 'table__date', components.getDateFormat(clientObj.createdAt));
  const createdAtTdTime = components.createEl('span', 'table-text', components.getTimeFormat(clientObj.createdAt));
  createdAtTdTime.classList.add('span-text');

  const updatedAtTd = components.createEl('td');
  const updatedAtTdDate = components.createEl('span', 'table__date', components.getDateFormat(clientObj.updatedAt));
  const updatedAtTdTime = components.createEl('span', 'table-text', components.getTimeFormat(clientObj.updatedAt));
  updatedAtTdTime.classList.add('span-text');

  const contactsTd = components.createEl('td');
  const contactsBox = components.createEl('div', 'contacts__box-item');
  contactsBox.classList.add(`contacts__box-item-${clientObj.id}`);
  contactsTd.append(contactsBox);

  const actionTd = components.createEl('td', 'btn-box');
  const changeBtn = components.createEl('button', 'btn-change', 'Изменить');
  const removeBtn = components.createEl('button', 'btn-reset', 'Удалить');

  createdAtTd.append(createdAtTdDate, createdAtTdTime);
  updatedAtTd.append(updatedAtTdDate, updatedAtTdTime);
  actionTd.append(changeBtn, removeBtn);
  clientTr.append(idTd, fulNameTd, createdAtTd, updatedAtTd, contactsTd, actionTd)

  // открытие модального окна "Изменить данные"
  $(changeBtn).on("click", function () {
    modalSpace.append(createModal('Изменить данные', clientObj));
  });

  // Открытие модального окна "Удалить клиента"
  $(removeBtn).on("click", function () {
    modalSpace.append(createModal('Удалить клиента', clientObj));
  });

  if (clientObj.contacts.length > 5) {
    contactsBox.classList.add('contacts__box-item--wrap');
  }

  // console.log(contactsBox)

  // Отрисовка списка контактов
  clientObj.contacts.forEach((el) => {

    let contactTypeName = 'Контакт';
    switch (el.type) {
      case "phone": contactTypeName = "Телефон"; break;
      case "mail": contactTypeName = "Email"; break;
      case "tg": contactTypeName = "Телеграм"; break;
      case "vk": contactTypeName = "Вконтакте"; break;
      case "fb": contactTypeName = "Фейсбук"; break;
      default: contactTypeName = "Контакт"; break;
    }

    // Вместо элемента создаётся объект
    const linkContact = $('<a>', {
      href: el.value,
      class: `${el.type} contacts__item`,
      target: '_blank',
      tooltip: `${contactTypeName}: ${el.value}`
    });

    contactsBox.append(linkContact[0]);
  })

  return clientTr
}

// Функция отрисовки таблицы всех пользователей
function renderClientsList(arr) {
  tbody.innerHTML = '';
  arr.forEach(clientItem => {
    tbody.append(createClientItem(clientItem));
  })
}

// функция сортировки массива пользователей
function getSortClientsList(prop) {
  const sortArr = [...clientsList];
  sortArr.sort((a, b) => (!dir
    ? a[prop] < b[prop]
    : a[prop] > b[prop])
    ? -1
    : 0);
  dir == true ? dir = false : dir = true;
  if (prop === 'surname') {
    $(`#${prop}Sort`).toggleClass('sortA-123');
    $(`#${prop}Sort`).toggleClass('sortA-321');
  } else {
    $(`#${prop}Sort`).toggleClass('sort-123');
    $(`#${prop}Sort`).toggleClass('sort-321');
  }
  return renderClientsList(sortArr);
}


// Start
// первоначальный массив пользователей 
let clientsList = [];
let contactCounter = 0;

// Проверка наличия данных в LS
clientsList = checkLS();

// открытие модального окна "Новый клиент"
$('#addClientBtn').on("click", function () {
  modalSpace.append(createModal('Новый клиент'));
})

// Анимация индикатора загрузки и отрисовка таблицы пользователей
$('.loader').removeClass("visually-hidden");
setTimeout(() => {
  $('.loader').addClass("visually-hidden");
  clientsList ? renderClientsList(clientsList) : checkLS();
}, 2000);


// СОРТИРОВКА. События кликов на соответствующие колонки для сортировки
let dir = true;
$('#tableID').on("click", function (event) {
  if (event._isClick === true) return
  getSortClientsList('id');
});

$('#tableFIO').on("click", function (event) {
  if (event._isClick === true) return
  getSortClientsList('surname');
});

$('#tableDate').on("click", function (event) {
  if (event._isClick === true) return
  getSortClientsList('createdAt');
});

$('#tableChanges').on("click", function (event) {
  if (event._isClick === true) return
  getSortClientsList('updatedAt');
});

export {
  clientsList,
  renderClientsList
}
