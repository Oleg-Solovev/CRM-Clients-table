// Подключение библиотеки jQuery
$(document).ready()


// Функция фильтра поискового запроса
function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  }
}

// Функция сохранения массива пользователей в LS 
function saveInLocalStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

// Функция загрузки массива пользователей из LS 
function downloadFromLocalStorage(name) {
  let data = localStorage.getItem(name);
  return data ? JSON.parse(data) : [];
}

//  Функция проверки списка пользователей в LS
function checkLocalServer() {

  let clientsArr = downloadFromLocalStorage('clientsArr');
  if (clientsArr.length === 0) {
    clientsList = [
      {
        id: Math.round(Math.random() * 1000),
        name: 'Олег',
        surname: 'Соловьёв',
        lastName: 'Валерьевич',
        createdAt: new Date(),
        updatedAt: new Date(),
        contacts: [
          {
            type: 'phone',
            value: '+79032067266'
          },
          {
            type: 'mail',
            value: 'so555@bk.ru'
          },
          {
            type: 'vk',
            value: 'https://vk.com/id2003039'
          },
          {
            type: 'tg',
            value: 'https://t.me/Oleg7266'
          }
        ]
      },
      {
        id: Math.round(Math.random() * 1000),
        name: 'Павел',
        surname: 'Балов',
        lastName: 'Сергеевич',
        createdAt: new Date(),
        updatedAt: new Date(),
        contacts: [
          {
            type: 'phone',
            value: '+71234567890'
          },
          {
            type: 'mail',
            value: 'abc@bk.ru'
          },
          {
            type: 'vk',
            value: 'https://vk.com/id2003039'
          }
        ]
      },
      {
        id: Math.round(Math.random() * 1000),
        name: 'Вячеслав',
        surname: 'Иванов',
        lastName: 'Павлович',
        createdAt: new Date(),
        updatedAt: new Date(),
        contacts: [
          {
            type: 'phone',
            value: '+71234567890'
          },
          {
            type: 'mail',
            value: 'abc@bk.ru'
          },
          {
            type: 'vk',
            value: 'https://vk.com/id2003039'
          }
        ]
      },
    ];
    // сохранение первоначального массива пользователей на сервер
    saveInLocalStorage('clientsArr', clientsList);
  } else {
    clientsList = clientsArr;
  }
  return clientsList
}

//  Функция работы с запросом в LS
function getFetch(item = '', id = '') {
  if (item) {
    let clientsList = downloadFromLocalStorage('clientsArr');
    let newClientsList = clientsList.filter(client => client.id !== id);
    item.updatedAt = new Date();
    newClientsList.push(item);
    saveInLocalStorage('clientsArr', newClientsList);

  } else {
    let clientsList = downloadFromLocalStorage('clientsArr');
    let newClientsList = clientsList.filter(client => client.id !== id)
    saveInLocalStorage('clientsArr', newClientsList);
  };
}

// Функция преобразования даты
function getDateFormat(data) {
  let date = new Date(data);
  let result = date.getDate() < 10 ? '0' + date.getDate() + '.' : date.getDate() + '.';
  result = result + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) + '.' : (date.getMonth() + 1) + '.');
  result = result + date.getFullYear();
  return result
}

// Функция преобразования времени
function getTimeFormat(data) {
  let time = new Date(data);
  let result = time.getHours() < 10 ? '0' + time.getHours() + ':' : time.getHours() + ':';
  result = result + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
  return result
}

// Функция создания инпута с label
function createInput(name, placeholder) {
  const newLabel = createEl('label', 'form__field');
  const labelText = createEl('span', 'form__text', placeholder);
  const labelStar = createEl('span', 'star', '*');
  labelText.append(labelStar);
  newLabel.append(labelText);
  const newInput = createEl('input', 'form__input');
  newInput.name = name;
  newInput.type = 'text';
  newInput.autocomplete = 'off';
  newInput.required = true;
  newLabel.append(newInput);
  return newLabel
}

// Функция создания DOM элементов
function createEl(el, className = 'x', text = '') {
  const element = document.createElement(el);
  element.classList.add(className);
  if (el === 'button') {
    element.classList.add('btn');
  };
  element.textContent = text;
  return element
}

// Функция создания модальных окон
function createModal(typeModal, clientObj = {}) {

  // Общие элементы для всех модальных окон
  const modalParent = createEl('div', 'modal__parent');
  const modalWrapper = createEl('div', 'modal__wrapper');
  const modalFormWrapper = createEl('form', 'form');
  modalFormWrapper.autocomplete = 'off';
  const btnModalReset = createEl('button', 'btn-modal-reset');
  const modalTitle = createEl('h2', 'modal__title');
  if (typeModal === 'Удалить клиента') {
    modalTitle.classList.add('modal__title--delate');
  }
  const modalTitleSpan = createEl('span', 'modal__title-bold', typeModal);
  modalTitle.append(modalTitleSpan);

  const formBtnBox = createEl('div', 'form__btn-box');
  const cancelBtn = createEl('button', 'cancel-btn', 'Отмена');
  modalFormWrapper.append(btnModalReset, modalTitle);
  modalWrapper.append(modalFormWrapper);
  modalParent.append(modalWrapper);
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

    const modalForm = createEl('div', 'form__input-wapper');
    const surnameInput = createInput('surname', 'Фамилия');
    const nameInput = createInput('name', 'Имя');
    const lastNameInput = createInput('lastName', 'Отчество');
    const formAddContact = createEl('div', 'form__add-contact');
    const formAddContactWrapp = createEl('div', 'form__add-contact-wrapp');
    const btnAddContact = createEl('button', 'add-contact-btn', 'Добавить контакт');
    const saveClientBtn = createEl('button', 'client-btn', 'Сохранить');
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
        let contacts = [];
        const contactType = document.querySelectorAll('.js-choice');
        const contactValue = document.querySelectorAll('.input-contact');

        for (let i = 0; i < contactType.length; i++) {
          contacts.push({
            type: contactType[i].value,
            value: contactValue[i].value
          })
        }

        let newClient = {
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
          getFetch(newClient);
        } else {
          if (typeModal === 'Изменить данные') {
            getFetch(newClient, clientObj.id);
          }
        };

        // при положительном запросе отрисовка таблицы клиентов
        let clientsArr = downloadFromLocalStorage('clientsArr');
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
      const deleteChangeBtn = createEl('button', 'delete-btn', 'Удалить клиента');
      formBtnBox.append(saveClientBtn, deleteChangeBtn);
      let titleID = createEl('span', 'table-text', `ID: ${clientObj.id}`);
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
    // const textMassage = $('<p>').addClass('text-massage');

    const textMassage = document.createElement('p');
    textMassage.classList.add('text-massage');
    textMassage.textContent = 'Вы действительно хотите удалить данного клиента?';
    const deleteBtn = createEl('button', 'client-btn', 'Удалить');
    // deleteBtn.classList.add('client-btn-delete');
    formBtnBox.append(deleteBtn, cancelBtn);
    modalFormWrapper.append(textMassage, formBtnBox);

    // удаление клиента из базы LS
    $('.client-btn-delete').on("click", e => {
      e.preventDefault();
      $('#modalSpace').empty();
      getFetch('', clientObj.id);
      clientsList = downloadFromLocalStorage('clientsArr');
      renderClientsList(clientsList);
    });
    return modalParent
  }
}


// Функция, возвращая новый контакт
function getNewContact(obj = {}) {
  // Массив типов контактов
  let contactsTypeArr = [
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
  let newContact = createEl('div', 'contacts');

  // создание селекта
  const selectWrapper = createEl('div', 'select-wrapper');
  const select = createEl('select', 'js-choice');

  select.onclick = function () {
    selectWrapper.classList.toggle('is-open');
  }

  for (let i = 0; i < contactsTypeArr.length; i++) {
    const option = createEl('option', 'option-contact', contactsTypeArr[i].text);
    option.value = contactsTypeArr[i].value;
    select.append(option);
  }
  selectWrapper.append(select);

  // создание инпута
  const input = createEl('input', 'input-contact');
  input.type = "text";
  obj.value ? input.value = obj.value : input.placeholder = 'Введите данные контакта';

  const deleteContactBtn = createEl('button', 'delete-contact-btn');
  $(deleteContactBtn).attr("tooltip", "Удалить контакт");
  newContact.append(selectWrapper, input, deleteContactBtn)

  // инициализация библиотеки choices
  const choice = new Choices(select, {
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
    allowHTML: true,
  });

  // удаление строки контакта
  deleteContactBtn.onclick = function () {
    --contactCounter;

    if (contactCounter < 10) {
      let btnAddContact = document.querySelector('.add-contact-btn');
      if (btnAddContact.classList.contains('visually-hidden')) {
        $('btnAddContact').removeClass('visually-hidden');
      }
      newContact.remove();
    }
  }
  return newContact
}

// функция фильтрации таблицы по запросу
function filterClients() {
  const text = filterRequest.value;
  const filterArr = clientsList.filter(el =>
    el.name.toLowerCase().includes(text.toLowerCase())
    || el.surname.toLowerCase().includes(text.toLowerCase())
    || el.lastName.toLowerCase().includes(text.toLowerCase())
    || el.id == text
  )
  return renderClientsList(filterArr);
}

// Функция валидации формы
function validationForm(form) {

  // Текст ошибки
  function createError(input, text) {
    // Получить родителя элемента (parentNode)
    const parent = input.parentNode;
    const errorLabel = document.createElement('label');
    errorLabel.classList.add('error-label');
    errorLabel.textContent = text;
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
    let text = input.value.trim();
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
  const clientTr = createEl('tr');
  const idTd = createEl('td', 'table-text', clientObj.id);
  const fulNameTd = createEl('td', 'table__cell', `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`);
  //  сделать отдельную функцию для createdAtTd и updatedAtTd как двух типов
  const createdAtTd = createEl('td');
  const createdAtTdDate = createEl('span', 'table__date', getDateFormat(clientObj.createdAt));
  const createdAtTdTime = createEl('span', 'table-text', getTimeFormat(clientObj.createdAt));
  createdAtTdTime.classList.add('span-text');

  const updatedAtTd = createEl('td');
  const updatedAtTdDate = createEl('span', 'table__date', getDateFormat(clientObj.updatedAt));
  const updatedAtTdTime = createEl('span', 'table-text', getTimeFormat(clientObj.updatedAt));
  updatedAtTdTime.classList.add('span-text');

  const contactsTd = createEl('td');
  const contactsBox = createEl('div', 'contacts__box-item');
  contactsTd.append(contactsBox);
  const actionTd = createEl('td', 'btn-box');
  const changeBtn = createEl('button', 'btn-change', 'Изменить');
  const removeBtn = createEl('button', 'btn-reset', 'Удалить');

  createdAtTd.append(createdAtTdDate, createdAtTdTime);
  updatedAtTd.append(updatedAtTdDate, updatedAtTdTime);

  // Отрисовка списка контактов
  clientObj.contacts.forEach((el) => {
    let linkContact = document.createElement('a');
    // linkContact.href = `${el.value}`;
    linkContact.href = el.value;
    // linkContact.classList.add(`${el.type}`, "contacts__item");
    linkContact.classList.add(el.type, 'contacts__item');
    linkContact.target = '_blank';
    let contactTypeName = 'Контакт';
    switch (el.type) {
      case "phone": contactTypeName = "Телефон"; break;
      case "mail": contactTypeName = "Email"; break;
      case "tg": contactTypeName = "Телеграм"; break;
      case "vk": contactTypeName = "Вконтакте"; break;
      case "fb": contactTypeName = "Фейсбук"; break;
      default: contactTypeName = "Контакт"; break;
    }
    linkContact.setAttribute("tooltip", `${contactTypeName}: ${el.value}`);
    contactsBox.append(linkContact);
  })

  if (clientObj.contacts.length > 5) {
    contactsBox.classList.add('contacts__box-item--wrap');
  }
  actionTd.append(changeBtn, removeBtn);

  // открытие модального окна "Изменить данные"
  $(changeBtn).on("click", function () {
    modalSpace.append(createModal('Изменить данные', clientObj));
  });

  // Открытие модального окна "Удалить клиента"
  $(removeBtn).on("click", function () {
    modalSpace.append(createModal('Удалить клиента', clientObj));
  });

  clientTr.append(idTd, fulNameTd, createdAtTd, updatedAtTd, contactsTd, actionTd)
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
clientsList = checkLocalServer();

// открытие модального окна "Новый клиент"
$('#addClientBtn').on("click", function () {
  modalSpace.append(createModal('Новый клиент'));
})

// Анимация индикатора загрузки и отрисовка таблицы пользователей
$('.loader').removeClass("visually-hidden");
setTimeout(() => {
  $('.loader').addClass("visually-hidden");
  clientsList ? renderClientsList(clientsList) : checkLocalServer();
}, 2000);

// Запуск функции поиска-фильтра
$('#filterRequest').on('keyup', debounce(filterClients, 3000));

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



