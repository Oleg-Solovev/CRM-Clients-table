// весь код в функции, чтобы сработал await
async function apiCRM() {

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
    let newContact = document.createElement("div");
    let select = document.createElement("select");
    select.classList.add("add-box__select");
    for (let i = 0; i < optionsArr.length; i++) {
      let option = document.createElement("option")
      option.textContent = optionsArr[i].text
      option.value = optionsArr[i].value
      select.append(option)
    }
    // Функция, возвращающая новый input
    function getInput(type, placeholder) {
      let input = document.createElement("input")
      input.classList.add("add-box__inp")
      input.type = type
      input.placeholder = placeholder
      return input
    }
    let deleteBtn = document.createElement("button")
    newContact.append(select, input, deleteBtn)
    return select
  }

  // Функция вывода одного пользователя в таблицу 
  function createClientItem(clientObj) {
    const clientTr = document.createElement("tr");
    const idTd = document.createElement("td");
    const fulNameTd = document.createElement("td");
    const createdAtTd = document.createElement("td");
    const updatedAtTd = document.createElement("td");
    const contactsTd = document.createElement("td");
    const actionTd = document.createElement("td");
    const changeBtn = document.createElement("button");
    const removeBtn = document.createElement("button");

    // Добавление данных из объекта в ячейки таблицы
    idTd.textContent = clientObj.id;
    fulNameTd.textContent = `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`;
    createdAtTd.textContent = clientObj.createdAt;
    updatedAtTd.textContent = clientObj.updatedAt;

    // Отрисовка списка контактов
    clientObj.contacts.forEach((el) => {
      let linkContact = document.createElement('a');
      linkContact.href = `${el.value}`;
      linkContact.classList.add(`${el.type}`);
      contactsTd.append(linkContact);
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
      surnameChangeInp.value = clientObj.surname.value;
      nameChangeInp.value = clientObj.name.value;
      lastNameChangeInp.value = clientObj.lastName.value;
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
  const addNewBtn = document.getElementById('addContactBtn');
  const saveNewClientBtn = document.getElementById('saveNewClientBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  let surnameNewInp = document.getElementById('newSurname');
  let nameNewInp = document.getElementById('newName');
  let lastNameNewInp = document.getElementById('newLastname');




  // открытие модального окна "Новый клиент"
  openFormBtn.addEventListener("click", function () {
    modalNewForm.classList.add("modal-parent--open");
    surnameNewInp.value = '';
    nameNewInp.value = '';
    lastNameNewInp.value = '';
  })

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

      let newClient = {
        name: nameNewInp.value.trim(),
        surname: surnameNewInp.value.trim(),
        lastName: lastNameNewInp.value.trim(),
      };

      // Добавляем нового студента на сервер и в локальный массив, затем выводим список
      await saveInLocalServer(newClient);
      clientsList = await getFromLocalServer();
      renderClientsList(clientsList);

      // Закрытие модального окна "Новый клиент" 
      modalNewForm.classList.remove("modal-parent--open")
    }
  })

  // Загрузка модального окна "Изменить данные" в JS
  const modalChangeForm = document.getElementById('formChange');
  const addChangeBtn = document.getElementById('addChangeContactBtn');
  const saveChangeClientBtn = document.getElementById('saveChangeContactBtn');
  const deleteChangeBtn = document.getElementById('deleteChangeBtn');
  let surnameChangeInp = document.getElementById('changeSurname');
  let nameChangeInp = document.getElementById('changeName');
  let lastNameChangeInp = document.getElementById('changeLastname');

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