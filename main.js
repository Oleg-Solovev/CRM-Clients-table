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
    return clientsList;
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
    return clientsArr;
  }

  //  Функция загрузки массива пользователей с сервера
  async function getFromLocalServer() {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'GET'
    });
    let clientsArr = await response.json();
    return clientsArr;
  }

  //  Функция удаления пользователя на сервере
  async function deleteFromLocalServer(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE'
    });
    let clientsArr = await response.json();
    return clientsArr;
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

  // Функция, возвращая новый контакт
  function getNewContact() {
    // Массив типов контактов
    let contactsTypeArr = [
      {
        text: "Телефон",
        value: "phone"
      },
      {
        text: "Эл. почта",
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
    let select = document.createElement("select");
    select.classList.add("select-contact");
    for (let i = 0; i < contactsTypeArr.length; i++) {
      let option = document.createElement("option")
      option.textContent = contactsTypeArr[i].text
      option.value = contactsTypeArr[i].value
      select.append(option)
    }

    // создание инпута
    let input = document.createElement("input");
    input.classList.add("input-contact");
    input.type = "text";
    input.placeholder = 'Введите данные контакта';

    const deleteContactBtn = document.createElement("button");
    deleteContactBtn.classList.add("delete-contact-btn");
    deleteContactBtn.setAttribute("tooltip", "Удалить контакт");

    // удаление строки контакта
    deleteContactBtn.onclick = function () {
      newContact.remove();
      contactCounter--;
      if (contactCounter > 10) {
        addContactBtn.classList.add('visually-hidden');
      }
    }
    console.log(contactCounter);


    newContact.append(select, input, deleteContactBtn)
    return newContact;
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

    return accept
  }

  // Функция вывода одного пользователя в таблицу 
  function createClientItem(clientObj) {
    const clientTr = document.createElement("tr");
    const idTd = document.createElement("td");
    idTd.classList.add('table-text');
    const fulNameTd = document.createElement("td");
    const createdAtTd = document.createElement("td");
    const createdAtTdTime = document.createElement("span");
    createdAtTdTime.classList.add('table-text', 'span-text');
    const updatedAtTd = document.createElement("td");
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
    createdAtTd.textContent = `${getDateFormat(clientObj.createdAt)}`
    createdAtTdTime.textContent = `${getTimeFormat(clientObj.createdAt)}`;
    createdAtTd.append(createdAtTdTime);
    updatedAtTd.textContent = `${getDateFormat(clientObj.updatedAt)}`;
    updatedAtTdTime.textContent = `${getTimeFormat(clientObj.updatedAt)}`;
    updatedAtTd.append(updatedAtTdTime);

    // Отрисовка списка контактов
    clientObj.contacts.forEach((el) => {
      let linkContact = document.createElement('a');
      linkContact.href = `${el.value}`;
      linkContact.classList.add(`${el.type}`, "contacts");
      linkContact.setAttribute("tooltip", `${el.value}`);
      contactsBox.append(linkContact);
    })

    changeBtn.textContent = "Изменить";
    changeBtn.classList.add('btn', 'btn-change');
    removeBtn.textContent = "Удалить";
    removeBtn.classList.add('btn', 'btn-reset');
    actionTd.classList.add('btn-box');
    actionTd.append(changeBtn, removeBtn);

    // Удаление строки с данными пользователя
    deleteContactBtn.onclick = function () {
      deleteFromLocalServer(clientObj.id);
      clientTr.remove();
    }

    // открытие модального окна "Изменить данные"
    changeBtn.addEventListener("click", function () {
      modalChangeForm.classList.add("modal-parent--open");

      // Очистка полей перед заполнением
      surnameChangeInp.value = '';
      nameChangeInp.value = '';
      lastNameChangeInp.value = '';
      titleID.textContent = '';

      surnameChangeInp.value = clientObj.surname;
      nameChangeInp.value = clientObj.name;
      lastNameChangeInp.value = clientObj.lastName;
      titleID.textContent = `ID: ${clientObj.id}`;
    })

    // открытие модального окна "Удалить клиента"
    removeBtn.addEventListener("click", function () {
      modalDeleteForm.classList.add("modal-parent--open");
    })

    clientTr.append(idTd, fulNameTd, createdAtTd, updatedAtTd, contactsTd, actionTd)
    return clientTr;
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
    // Отрисовка списка после сортировки
    return renderClientsList(sortArr);
  }

  // Start. 

  // первоначальный массив пользователей 
  let clientsList = [];
  // Проверка наличия данных на сервере
  clientsList = await checkLocalServer();


  // Создание статичных элементов html и загрузка интерактивных элементов в JS
  const openFormBtn = document.getElementById('addClientBtn');
  let filterRequest = document.getElementById('filterRequest');

  // Загрузка модального окна "Новый клиент" в JS
  const modalNewForm = document.getElementById('formNewClient');
  const addContactBtn = document.getElementById('addContactBtn');
  const formAddContact = document.getElementById('formAddContact');
  const saveNewClientBtn = document.getElementById('saveNewClientBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  let surnameNewInp = document.getElementById('newSurname');
  let nameNewInp = document.getElementById('newName');
  let lastNameNewInp = document.getElementById('newLastname');


  // открытие модального окна "Новый клиент"
  let contactCounter = 0;
  openFormBtn.addEventListener("click", function () {
    modalNewForm.classList.add("modal-parent--open");
    surnameNewInp.value = '';
    nameNewInp.value = '';
    lastNameNewInp.value = '';
  })

  // добавление новой строки контакта
  addContactBtn.onclick = function () {
    contactCounter++;
    if (contactCounter > 9) {
      addContactBtn.classList.add('visually-hidden');
    } else {
      formAddContact.prepend(getNewContact());
    }
  }



  // закрытие модального окна "Новый клиент"
  modalNewForm.querySelector(".modal").addEventListener("click", function (event) {
    event._isClick = true
  })
  cancelBtn.addEventListener("click", function (event) {
    if (event._isClick === true) return
    modalNewForm.classList.remove("modal-parent--open")
  })

  // закрытие модального окна "Новый клиент" по кнопке Esc
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      modalNewForm.classList.remove("modal-parent--open")
    }
  });

  // Кнопка отправки формы "Новый клиент" и проверка введённых данных
  saveNewClientBtn.addEventListener("click", async e => {
    e.preventDefault();

    if (validationForm(modalNewForm)) {

      let contacts = [];
      const contactType = document.querySelectorAll('.select-contact');
      const contactValue = document.querySelectorAll('.input-contact');

      for (let i = 0; i < contactType.length; i++) {
        contacts.push({
          type: contactType[i].value,
          value: contactValue[i].value
        })
      }

      let newClient = {
        name: nameNewInp.value.trim(),
        surname: surnameNewInp.value.trim(),
        lastName: lastNameNewInp.value.trim(),
        contacts: contacts,
      };

      // Добавляем нового клиента на сервер и в локальный массив, затем выводим список
      await saveInLocalServer(newClient);
      clientsList = await getFromLocalServer();
      renderClientsList(clientsList);

      // Закрытие модального окна "Новый клиент" 
      modalNewForm.classList.remove("modal-parent--open")
    }
  })

  // Загрузка модального окна "Изменить данные" в JS
  const modalChangeForm = document.getElementById('formChange');
  const modalTitle = document.getElementById('modalTitle');
  const addChangeBtn = document.getElementById('addChangeContactBtn');
  const saveChangeClientBtn = document.getElementById('saveChangeContactBtn');
  const deleteChangeBtn = document.getElementById('deleteChangeBtn');
  let surnameChangeInp = document.getElementById('changeSurname');
  let nameChangeInp = document.getElementById('changeName');
  let lastNameChangeInp = document.getElementById('changeLastname');
  let titleID = document.createElement("span");
  titleID.classList.add('table-text', 'span-text');
  modalTitle.append(titleID);


  addChangeBtn.onclick = function () {
    formAddContact.prepend(getNewContact());
  }



  // закрытие модального окна "Изменить данные"
  modalChangeForm.querySelector(".modal").addEventListener("click", function (event) {
    event._isClick = true
  })
  modalChangeForm.addEventListener("click", function (event) {
    if (event._isClick === true) return
    modalChangeForm.classList.remove("modal-parent--open")
  })

  // закрытие модального окна "Изменить данные" по кнопке Esc
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      modalChangeForm.classList.remove("modal-parent--open")
    }
  });


  // Загрузка модального окна "Удалить клиента" в JS
  const modalDeleteForm = document.getElementById('formDeleteClient');
  const deleteContactBtn = document.getElementById('deleteContactBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');


  // закрытие модального окна "Удалить клиента"
  modalDeleteForm.querySelector(".modal").addEventListener("click", function (event) {
    event._isClick = true
  })
  modalDeleteForm.addEventListener("click", function (event) {
    if (event._isClick === true) return
    modalDeleteForm.classList.remove("modal-parent--open")
  })
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      modalDeleteForm.classList.remove("modal-parent--open")
    }
  });


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