// весь код в функции, чтобы сработал await
async function apiCRM() {

  //  Короткая функция проверки данных в консоли
  function cl(data) {
    console.log(data);
  }

  //  Функция проверки списка пользователей на сервере
  async function checkLocalServer() {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'GET'
    });
    let clientsArr = await response.json();
    if (clientsArr.length === 0) {
      clientsList = [
        {
          name: 'Олег',
          surname: 'Соловьёв',
          lastName: 'Валерьевич',
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
          name: 'Павел',
          surname: 'Балов',
          lastName: 'Сергеевич',
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
          name: 'Вячеслав',
          surname: 'Иванов',
          lastName: 'Павлович',
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
      for (let clientItem of clientsList) {
        saveInLocalServer(clientItem);
      };
      // загрузка массива пользователей с сервера
      clientsList = await getFromLocalServer();
    } else {
      clientsList = clientsArr;
    }
    return clientsList
  }

  //  Функция сохранения пользователя на сервере
  async function saveInLocalServer(item) {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    let clientsArr = await response.json();
    return clientsArr
  }

  //  Функция изменения пользователя на сервере
  async function changeInLocalServer(item, id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    let clientsArr = await response.json();
    return clientsArr
  }

  //  Функция загрузки массива пользователей с сервера
  async function getFromLocalServer() {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'GET'
    });
    let clientsArr = await response.json();
    return clientsArr
  }

  //  Функция удаления пользователя на сервере
  async function deleteFromLocalServer(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE'
    });
    let clientsArr = await response.json();
    return clientsArr
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


  // Функция создания элементов для модальных окон
  function createModal(typeModal, clientObj = {}) {
    // Общие элементы для всех модальных окон
    const modalParent = createDiv('modal__parent');
    const modalWrapper = createDiv('modal__wrapper');
    const modalFormWrapper = createDiv('modal__form-wrapper');
    const btnModalReset = createBtn('btn-modal-reset', '');
    const modalTitle = createTitle(typeModal);
    const formBtnBox = createDiv('form__btn-box');
    const cancelBtn = createBtn('cancel-btn', 'Отмена');
    modalFormWrapper.append(btnModalReset, modalTitle);
    modalWrapper.append(modalFormWrapper);
    modalParent.append(modalWrapper);

    // Для модального окна Удалить клиента
    if (typeModal === 'Удалить клиента') {
      modalTitle.classList.add('modal__title--delate');
      const textMassage = document.createElement('p');
      textMassage.classList.add('text-massage');
      textMassage.textContent = 'Вы действительно хотите удалить данного клиента?';
      const deleteBtn = createBtn('delete-btn', 'Удалить клиента');
      deleteBtn.onclick = function () {
        deleteFromLocalServer(clientObj.id);
      }
      formBtnBox.append(deleteChangeBtn, cancelBtn);
      modalFormWrapper.append(textMassage, formBtnBox);
      return modalParent
    }

    // Общие элементы для модальных окон: Новый клиент и Изменить данные
    const modalForm = document.createElement('form');
    modalForm.autocomplete = 'off';
    modalForm.classList.add('form');
    const surnameInput = createInput('surname', 'Фамилия');
    const nameInput = createInput('name', 'Имя');
    const lastNameInput = createInput('lastName', 'Отчество');
    const formAddContact = createDiv('form__add-contact');
    const formAddContactWrapp = createDiv('form__add-contact-wrapp');
    const btnAddContact = createBtn('add-contact-btn', 'Добавить контакт');
    const saveClientBtn = createBtn('client-btn', 'Сохранить');
    modalForm.append(surnameInput, nameInput, lastNameInput);
    formAddContact.append(formAddContactWrapp, btnAddContact);
    modalFormWrapper.append(modalForm, formAddContact, formBtnBox);
    let contactCounter = 0;


    // Для модального окна "Новый клиент"
    if (typeModal === 'Новый клиент') {
      formBtnBox.append(saveClientBtn, cancelBtn);
      return modalParent
    }

    // Для модального окна "Изменить данные"
    if (typeModal === 'Изменить данные') {
      const deleteChangeBtn = createBtn('client-btn', 'Удалить клиента');
      formBtnBox.append(saveClientBtn, deleteChangeBtn);
      let titleID = createSpan('table-text', `ID: ${clientObj.id}`);
      titleID.classList.add('span-text');
      modalTitle.append(titleID);

      surnameInput.value = clientObj.surname;
      nameInput.value = clientObj.name;
      lastNameInput.value = clientObj.lastName;

      // Отрисовка списка контактов и заполнение полей
      clientObj.contacts.forEach((el) => {
        formAddContactWrapp.apend(getNewContact(el));
      })

      deleteChangeBtn.onclick = function () {
        createModal('Удалить клиента', clientObj);
      }

      return modalParent
    }


    // добавление новой строки контакта
    btnAddContact.addEventListener("click", async e => {
      e.preventDefault();
      contactCounter++;
      if (contactCounter > 10) {
        // btnAddContact.classList.add('visually-hidden');
        // Установка атрибута disabled
        btnAddContact.setAttribute('disabled', true);
      } else {
        if (btnAddContact.disabled) {
          btnAddContact.removeAttribute("disabled");
        }
        formAddContactWrapp.apend(getNewContact());
      }
    })


    // Кнопка сохранения данных клиента
    saveClientBtn.addEventListener("click", async e => {
      e.preventDefault();

      if (validationForm(modalForm)) {
        // создаём объект с новыми данными
        let newClient = createNewClient();

        // Добавляем нового клиента на сервер или изменяем существующего
        if (typeModal === 'Новый клиент') {
          await saveInLocalServer(newClient);
        } else {
          if (typeModal === 'Изменить данные') {
            await changeInLocalServer(newClient, clientObj.id);
          }
        }
        // Выводим список клиентов
        clientsList = await getFromLocalServer();
        renderClientsList(clientsList);

        // Закрытие и очистка полей модального окна
        // modalParent.classList.remove('modal__parent--open');
        // modalParent.innerHTML = '';
        modalParent.remove;
      }
    })


    // закрытие модальных окон
    cancelBtn.addEventListener("click", function (event) {
      if (event._isClick === true) return modalParent.remove
    });
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape")
        return modalParent.remove
    });
    modalParent.addEventListener("click", function (event) {
      if (event._isClick === true) return
      return modalParent.remove
    });
    btnModalReset.addEventListener("click", function () {
      return modalParent.remove
      // e.preventDefault();
      // modalParent.classList.remove('modal__parent--open');
      // modalParent.innerHTML = '';
    })



  }

  // Функция создания div
  function createDiv(data) {
    const newDiv = document.createElement('div');
    newDiv.classList.add(data);
    return newDiv
  }

  // Функция создания заголовка h1
  function createTitle(typeModal) {
    const title = document.createElement('h1');
    title.classList.add('modal__title');
    if (typeModal === 'Удалить клиента') {
      title.classList.add('modal__title--delate');
    }
    const newSpan = createSpan('modal__title-bold', typeModal);
    title.append(newSpan);
    return title
  }

  // Функция создания кнопки
  function createBtn(className, text) {
    const btn = document.createElement('button');
    btn.classList.add(`${className}`);
    btn.textContent = `${text}`;
    return btn
  }

  // Функция создания span элемента
  function createSpan(className, text) {
    const newSpan = document.createElement('span');
    newSpan.classList.add(`${className}`);
    newSpan.textContent = `${text}`;
    return newSpan
  }

  // Функция создания инпута
  function createInput(name, text) {
    const newLabel = document.createElement('label');
    newLabel.classList.add('form__field');
    const labelText = createSpan('form__text', text);
    const labelStar = createSpan('star', '*');
    labelText.append(labelStar);
    newLabel.append(labelText);
    const newInput = document.createElement('input');
    newInput.classList.add('form__input');
    newInput.name = name;
    newInput.type = 'text';
    newInput.autocomplete = 'off';
    newInput.required = true;
    newLabel.append(newInput);
    return newLabel
  }

  // Функция создания нового клиента
  function createNewClient() {

    let contacts = [];
    const contactType = document.querySelectorAll('.select-contact');
    const contactValue = document.querySelectorAll('.input-contact');

    for (let i = 0; i < contactType.length; i++) {
      contacts.push({
        type: contactType[i].value,
        value: contactValue[i].value
      })
    }

    // вывод данных в виде объекта
    return {
      name: nameInput.value.trim(),
      surname: surnameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      contacts: contacts,
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
    let newContact = document.createElement("div");
    newContact.classList.add("newContact-box");

    // создание селекта
    const selectWrapper = document.createElement("div");
    selectWrapper.classList.add("select-wrapper");
    const select = document.createElement("select");
    select.classList.add("select-contact");

    select.onclick = function () {
      selectWrapper.classList.toggle('is-open');
    }

    for (let i = 0; i < contactsTypeArr.length; i++) {
      let option = document.createElement("option");
      option.classList.add("option-contact");
      if (obj) {
        if (obj.type === contactsTypeArr[i].value) {
          option.selected = 'selected';
        }
      }
      option.textContent = contactsTypeArr[i].text;
      option.value = contactsTypeArr[i].value;
      select.append(option);
      selectWrapper.append(select);
    }

    // создание инпута
    let input = document.createElement("input");
    input.classList.add("input-contact");
    input.type = "text";
    if (obj.value) {
      input.value = obj.value;
    } else {
      input.placeholder = 'Введите данные контакта';
    }

    const deleteContactBtn = document.createElement("button");
    deleteContactBtn.classList.add("delete-contact-btn");
    deleteContactBtn.setAttribute("tooltip", "Удалить контакт");

    newContact.append(selectWrapper, input, deleteContactBtn)

    // удаление строки контакта
    deleteContactBtn.onclick = function () {
      newContact.remove();
      contactCounter--;
      if (contactCounter < 10) {
        createAddContactBtn();
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
        parent.classList.remove('error');
      }
    }

    let accept = true;

    // Проверка текстовых полей
    const allInputs = form.querySelectorAll('.input-text');
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
    const allInputsContacts = form.querySelectorAll('.input-contact');
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
    const clientTr = document.createElement("tr");
    const idTd = document.createElement("td");
    idTd.classList.add('table-text');
    const fulNameTd = document.createElement("td");
    const createdAtTd = document.createElement("td");
    const createdAtTdDate = document.createElement("span");
    createdAtTdDate.classList.add('table__date');
    const createdAtTdTime = document.createElement("span");
    createdAtTdTime.classList.add('table-text', 'span-text');
    const updatedAtTd = document.createElement("td");
    const updatedAtTdDate = document.createElement("span");
    updatedAtTdDate.classList.add('table__date');
    const updatedAtTdTime = document.createElement("span");
    updatedAtTdTime.classList.add('table-text', 'span-text');
    const contactsTd = document.createElement("td");
    const contactsBox = document.createElement("div");
    contactsBox.classList.add('contactsBox');
    contactsTd.append(contactsBox);
    const actionTd = document.createElement("td");
    const changeBtn = document.createElement("button");
    const removeBtn = document.createElement("button");

    // Добавление данных из объекта в ячейки таблицы
    idTd.textContent = clientObj.id;
    fulNameTd.textContent = `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`;
    createdAtTdDate.textContent = `${getDateFormat(clientObj.createdAt)}`
    createdAtTdTime.textContent = `${getTimeFormat(clientObj.createdAt)}`;
    createdAtTd.append(createdAtTdDate, createdAtTdTime);
    updatedAtTdDate.textContent = `${getDateFormat(clientObj.updatedAt)}`;
    updatedAtTdTime.textContent = `${getTimeFormat(clientObj.updatedAt)}`;
    updatedAtTd.append(updatedAtTdDate, updatedAtTdTime);

    // Отрисовка списка контактов
    clientObj.contacts.forEach((el) => {
      let linkContact = document.createElement('a');
      linkContact.href = `${el.value}`;
      linkContact.classList.add(`${el.type}`, "contacts");
      linkContact.target = '_blank';
      let contactTypeName = "Контакт";
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
      contactsBox.classList.add('contactsBoxWrap');
    }

    changeBtn.textContent = "Изменить";
    changeBtn.classList.add('btn', 'btn-change');
    removeBtn.textContent = "Удалить";
    removeBtn.classList.add('btn', 'btn-reset');
    actionTd.classList.add('btn-box');
    actionTd.append(changeBtn, removeBtn);

    // открытие модального окна "Изменить данные"
    changeBtn.addEventListener("click", function () {
      container.append(createModal('Изменить данные', clientObj));
    });

    // Открытие модального окна "Удалить клиента"
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      container.append(createModal('Удалить клиента', clientObj));
    })

    clientTr.append(idTd, fulNameTd, createdAtTd, updatedAtTd, contactsTd, actionTd)
    return clientTr
  }

  // Функция отрисовки таблицы всех пользователей
  function renderClientsList(arr) {
    tbody.innerHTML = '';
    const loader = document.querySelector(".loader");
    loader.classList.remove("visually-hidden");
    setTimeout(() => {
      loader.classList.add("visually-hidden");
      arr.forEach(clientItem => {
        tbody.append(createClientItem(clientItem));
      })
    }, 2000);
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
    cl(`${prop}Sort`);
    let sortImg = document.getElementById(`${prop}Sort`);
    if (prop === 'surname') {
      sortImg.classList.toggle('sortA-123');
      sortImg.classList.toggle('sortA-321');
    } else {
      sortImg.classList.toggle('sort-123');
      sortImg.classList.toggle('sort-321');
    }
    // Отрисовка списка после сортировки
    return renderClientsList(sortArr);
  }







  // Start

  // первоначальный массив пользователей 
  let clientsList = [];
  let itemId = 0;


  // Проверка наличия данных на сервере
  clientsList = await checkLocalServer();

  // Создание статичных элементов html
  const openFormBtn = document.getElementById('addClientBtn');
  let filterRequest = document.getElementById('filterRequest');
  const container = document.getElementById('container');

  // Создание модальных окон
  // let modalNew = createModal('Новый клиент');
  // let modalChange = createModal('Изменить данные', itemId);
  // let modalDelete = createModal('Удалить клиента', itemId);
  // container.append(modalNew, modalChange, modalDelete);


  // открытие модального окна "Новый клиент"
  openFormBtn.addEventListener("click", function () {
    container.append(createModal('Новый клиент'));
  })






  // Кнопка отправки формы "Изменить данные" и проверка введённых данных
  // saveChangeClientBtn.addEventListener("click", async e => {
  //   e.preventDefault();

  //   if (validationForm(modalChangeForm)) {

  //     let contacts = [];
  //     const contactType = document.querySelectorAll('.select-contact');
  //     const contactValue = document.querySelectorAll('.input-contact');

  //     for (let i = 0; i < contactType.length; i++) {
  //       contacts.push({
  //         type: contactType[i].value,
  //         value: contactValue[i].value
  //       })
  //     }

  //     let newClient = {
  //       name: nameChangeInp.value.trim(),
  //       surname: surnameChangeInp.value.trim(),
  //       lastName: lastNameChangeInp.value.trim(),
  //       contacts: contacts,
  //     };

  //     // Добавляем изменения данных клиента на сервер и затем выводим список
  //     await changeInLocalServer(newClient, itemId);
  //     clientsList = await getFromLocalServer();
  //     renderClientsList(clientsList);

  //     // Закрытие модального окна "Изменить данные" 
  //     modalChangeForm.classList.remove("modal-parent--open")
  //   }
  // })













  // закрытие модального окна "Удалить клиента"
  // modalDeleteForm.querySelector(".modal").addEventListener("click", function (event) {
  //   event._isClick = true
  // })
  // cancelDeleteBtn.addEventListener("click", function (event) {
  //   if (event._isClick === true) return
  //   modalDeleteForm.classList.remove("modal-parent--open")
  // })
  // modalDeleteForm.addEventListener("click", function (event) {
  //   if (event._isClick === true) return
  //   modalDeleteForm.classList.remove("modal-parent--open")
  // })
  // window.addEventListener("keydown", function (event) {
  //   if (event.key === "Escape") {
  //     modalDeleteForm.classList.remove("modal-parent--open")
  //   }
  // });


  //  Загрузка шапки и тела таблицы пользователей
  const tbody = document.getElementById('tbody');
  const tableID = document.getElementById('tableID');
  const tableFIO = document.getElementById('tableFIO');
  const tableDate = document.getElementById('tableDate');
  const tableChanges = document.getElementById('tableChanges');
  const tableContacts = document.getElementById('tableContacts');
  const tableActions = document.getElementById('tableActions');

  // Отрисовка таблицы пользователей
  renderClientsList(clientsList);

  // СОРТИРОВКА. События кликов на соответствующие колонки для сортировки
  let dir = true;
  tableID.addEventListener("click", function (event) {
    if (event._isClick === true) return
    getSortClientsList('id');
  });

  tableFIO.addEventListener("click", function (event) {
    if (event._isClick === true) return
    getSortClientsList('surname');
  });

  tableDate.addEventListener("click", function (event) {
    if (event._isClick === true) return
    getSortClientsList('createdAt');
  });

  tableChanges.addEventListener("click", function (event) {
    if (event._isClick === true) return
    getSortClientsList('updatedAt');
  });



}

apiCRM();