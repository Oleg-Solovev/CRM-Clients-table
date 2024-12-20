// весь код в функции, чтобы сработал await
async function apiCRM() {

  //  Короткая функция проверки данных в консоли
  function cl(data) {
    console.log(data);
  }

  // Функция фильтра поискового запроса
  function debounce(callback, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    }
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
        getFetch('POST', clientItem);
      };
      // загрузка массива пользователей с сервера
      clientsList = await getFetch('GET');
    } else {
      clientsList = clientsArr;
    }
    return clientsList
  }


  //  Функция работы с запросом fetch
  async function getFetch(method, item = '', id = '') {
    let response = '';
    if (item) {
      response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: method,
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } else {
      response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: method
      });
    }

    // если ошибка с сервера, запуск функции создания модального окна с текстом ошибки
    if (!response.ok) {
      cl(response)
      createModal('Ошибка', response);
      return false
    }

    return response
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

  // Функция создания ячейки таблицы
  function createTd(className = 'x', text = '') {
    const element = document.createElement("td");
    element.classList.add(className);
    element.textContent = text;
    return element
  }

  // Функция создания элементов для модальных окон
  function createModal(typeModal, clientObj = {}) {

    // Общие элементы для всех модальных окон
    const modalParent = createDiv('modal__parent');
    const modalWrapper = createDiv('modal__wrapper');
    const modalFormWrapper = createDiv('modal__form-wrapper');
    const btnModalReset = createBtn('btn-modal-reset');
    const modalTitle = createTitle(typeModal);
    const formBtnBox = createDiv('form__btn-box');
    const cancelBtn = createBtn('cancel-btn', 'Отмена');
    modalFormWrapper.append(btnModalReset, modalTitle);
    modalWrapper.append(modalFormWrapper);
    modalParent.append(modalWrapper);
    modalSpace.append(modalParent);

    // закрытие всех модальных окон
    cancelBtn.addEventListener("click", function () {
      modalSpace.innerHTML = '';
    });
    btnModalReset.addEventListener("click", function () {
      return modalSpace.innerHTML = ''
    })
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape")
        return modalSpace.innerHTML = ''
    });


    // Общие элементы для модальных окон: Новый клиент и Изменить данные
    if (typeModal === 'Новый клиент' || typeModal === 'Изменить данные') {
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

      if (typeModal === 'Изменить данные') {
        contactCounter = clientObj.contacts.length;
      } else {
        contactCounter = 0;
      }

      // добавление новой строки контакта
      btnAddContact.addEventListener("click", async e => {
        e.preventDefault();
        ++contactCounter;
        if (contactCounter > 9) {
          btnAddContact.classList.add('visually-hidden');
        } else {
          if (btnAddContact.classList.contains('visually-hidden')) {
            btnAddContact.classList.remove('visually-hidden');
          }
          formAddContactWrapp.append(getNewContact());
        }
      })


      // Кнопка сохранения данных и создания объекта клиента
      saveClientBtn.addEventListener("click", async e => {
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
            name: nameInput.querySelector('.form__input').value.trim(),
            surname: surnameInput.querySelector('.form__input').value.trim(),
            lastName: lastNameInput.querySelector('.form__input').value.trim(),
            contacts: contacts,
          };

          // Добавляем нового клиента на сервер или изменяем существующего
          let response = '';
          if (typeModal === 'Новый клиент') {
            response = await getFetch('POST', newClient);
          } else {
            if (typeModal === 'Изменить данные') {
              response = await getFetch('PATCH', newClient, clientObj.id);
            }
          };

          // при положительном запросе отрисовка таблицы клиентов
          cl(response)
          if (response) {
            modalSpace.innerHTML = '';
            clientsList = await (await getFetch('GET')).json();
            renderClientsList(clientsList);
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
        const deleteChangeBtn = createBtn('delete-btn', 'Удалить клиента');
        formBtnBox.append(saveClientBtn, deleteChangeBtn);
        let titleID = createSpan('table-text', `ID: ${clientObj.id}`);
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
        deleteChangeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          modalSpace.append(createModal('Удалить клиента', clientObj));
        })
        return modalParent
      }
    }

    // Для модального окна "Ошибка"
    if (typeModal === 'Ошибка') {
      const errorMassage = document.createElement('p');
      errorMassage.classList.add('error-label');
      cl(clientObj.status)
      let text = '';
      switch (clientObj.status) {
        case 422: text = "Некорректные данные в аргументе, клиент не создан"; break;
        case 404: text = "Клиент с таким ID не найден"; break;
        case 500: text = "Что-то пошло не так"; break;
        default: text = `Код ошибки: ${clientObj.status}`; break;
      }
      errorMassage.textContent = text;
      formBtnBox.append(cancelBtn);
      modalFormWrapper.append(errorMassage, formBtnBox);
      return modalParent
    }

    // Для модального окна Удалить клиента
    if (typeModal === 'Удалить клиента') {
      modalTitle.classList.add('modal__title--delate');
      const textMassage = document.createElement('p');
      textMassage.classList.add('text-massage');
      textMassage.textContent = 'Вы действительно хотите удалить данного клиента?';
      const deleteBtn = createBtn('client-btn', 'Удалить');
      formBtnBox.append(deleteBtn, cancelBtn);
      modalFormWrapper.append(textMassage, formBtnBox);

      // удаление клиента из базы
      deleteBtn.addEventListener("click", async e => {
        e.preventDefault();
        modalSpace.innerHTML = '';
        await getFetch('DELETE', '', clientObj.id);
        // clientsList = await getFetch('GET');
        clientsList = await (await getFetch('GET')).json();
        renderClientsList(clientsList);
      });
      return modalParent
    }

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
  function createBtn(className, text = '') {
    const btn = document.createElement('button');
    btn.classList.add('btn', `${className}`);
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


  // Функция создания инпута с label
  function createInput(name, placeholder) {
    const newLabel = document.createElement('label');
    newLabel.classList.add('form__field');
    const labelText = createSpan('form__text', placeholder);
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
    let newContact = createDiv('contacts');

    // создание селекта
    const selectWrapper = createDiv('select-wrapper');
    const select = document.createElement("select");
    select.classList.add("js-choice");

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

    // создание инпута (без label, поэтому без функции)
    let input = document.createElement("input");
    input.classList.add("input-contact");
    input.type = "text";
    if (obj.value) {
      input.value = obj.value;
    } else {
      input.placeholder = 'Введите данные контакта';
    }

    const deleteContactBtn = createBtn('delete-contact-btn');
    deleteContactBtn.setAttribute("tooltip", "Удалить контакт");
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
          btnAddContact.classList.remove('visually-hidden');
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
      el.name.toLowerCase().includes(text.toLowerCase()) ||
      el.surname.toLowerCase().includes(text.toLowerCase()) ||
      el.lastName.toLowerCase().includes(text.toLowerCase()) ||
      el.id.includes(text)
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
        parent.classList.remove('error');
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
    const clientTr = document.createElement("tr");
    const idTd = createTd('table-text', clientObj.id);
    const fulNameTd = createTd('table__cell', `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`);
    const createdAtTd = createTd();
    const createdAtTdDate = createSpan('table__date', `${getDateFormat(clientObj.createdAt)}`);
    const createdAtTdTime = createSpan('table-text', `${getTimeFormat(clientObj.createdAt)}`);
    createdAtTdTime.classList.add('span-text');
    const updatedAtTd = createTd();
    const updatedAtTdDate = createSpan('table__date', `${getDateFormat(clientObj.updatedAt)}`);
    const updatedAtTdTime = createSpan('table-text', `${getTimeFormat(clientObj.updatedAt)}`);
    updatedAtTdTime.classList.add('span-text');
    const contactsTd = createTd();
    const contactsBox = createDiv('contacts__box-item');
    contactsTd.append(contactsBox);
    const actionTd = createTd('btn-box');
    const changeBtn = createBtn('btn-change', 'Изменить');
    const removeBtn = createBtn('btn-reset', 'Удалить');

    createdAtTd.append(createdAtTdDate, createdAtTdTime);
    updatedAtTd.append(updatedAtTdDate, updatedAtTdTime);

    // Отрисовка списка контактов
    clientObj.contacts.forEach((el) => {
      let linkContact = document.createElement('a');
      linkContact.href = `${el.value}`;
      linkContact.classList.add(`${el.type}`, "contacts__item");
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
      contactsBox.classList.add('contacts__box-item--wrap');
    }
    actionTd.append(changeBtn, removeBtn);

    // открытие модального окна "Изменить данные"
    changeBtn.addEventListener("click", function () {
      modalSpace.append(createModal('Изменить данные', clientObj));
    });

    // Открытие модального окна "Удалить клиента"
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modalSpace.append(createModal('Удалить клиента', clientObj));
    })

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
    let sortImg = document.getElementById(`${prop}Sort`);
    if (prop === 'surname') {
      sortImg.classList.toggle('sortA-123');
      sortImg.classList.toggle('sortA-321');
    } else {
      sortImg.classList.toggle('sort-123');
      sortImg.classList.toggle('sort-321');
    }
    return renderClientsList(sortArr);
  }




  // Start
  // первоначальный массив пользователей 
  let clientsList = [];
  let contactCounter = 0;

  // Проверка наличия данных на сервере
  clientsList = await checkLocalServer();

  // Создание статичных элементов html
  const openFormBtn = document.getElementById('addClientBtn');
  const filterRequest = document.getElementById('filterRequest');
  const modalSpace = document.getElementById('modalSpace');

  // открытие модального окна "Новый клиент"
  openFormBtn.addEventListener("click", function () {
    modalSpace.append(createModal('Новый клиент'));
  })

  //  Загрузка шапки и тела таблицы пользователей
  const tbody = document.getElementById('tbody');
  const tableID = document.getElementById('tableID');
  const tableFIO = document.getElementById('tableFIO');
  const tableDate = document.getElementById('tableDate');
  const tableChanges = document.getElementById('tableChanges');

  // Анимация индикатора загрузки и отрисовка таблицы пользователей
  const loader = document.querySelector(".loader");
  loader.classList.remove("visually-hidden");
  setTimeout(() => {
    loader.classList.add("visually-hidden");
    renderClientsList(clientsList);
  }, 2000);

  // Запуск функции поиска-фильтра
  filterRequest.addEventListener('keydown', debounce(filterClients, 3000));

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