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
          lastname: 'Валерьевич',
          contacts: [
            {
              type: 'Телефон',
              value: '+79032067266'
            },
            {
              type: 'Email',
              value: 'so555@bk.ru'
            },
            {
              type: 'Вконтакте',
              value: 'https://vk.com/id2003039'
            },
            {
              type: 'Телеграм',
              value: 'https://t.me/Oleg7266'
            }
          ]
        },
        {
          name: 'Павел',
          surname: 'Балов',
          lastname: 'Сергеевич',
          contacts: [
            {
              type: 'Телефон',
              value: '+71234567890'
            },
            {
              type: 'Email',
              value: 'abc@bk.ru'
            },
            {
              type: 'Вконтакте',
              value: 'https://vk.com/id2003039'
            }
          ]
        },
        {
          name: 'Вячеслав',
          surname: 'Иванов',
          lastname: 'Павлович',
          contacts: [
            {
              type: 'Телефон',
              value: '+71234567890'
            },
            {
              type: 'Email',
              value: 'abc@bk.ru'
            },
            {
              type: 'Вконтакте',
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
  async function deleteFromLocalServer(id, element) {
    if (!confirm('Вы уверены?')) {
      return;
    }
    element.remove();
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

  // Функция вывода одного пользователя в таблицу 
  function createClientItem(clientObj) {
    let clientTr = document.createElement("tr")
    let idTd = document.createElement("td")
    let fulNameTd = document.createElement("td")
    let createdAtTd = document.createElement("td")
    let updatedAtTd = document.createElement("td")
    let contactsTd = document.createElement("td")
    let actionTd = document.createElement("td")
    let changeBtn = document.createElement("button")
    let removeBtn = document.createElement("button")

    // Удаление строки с данными пользователя
    removeBtn.onclick = function () {
      deleteFromLocalServer(clientObj.id, clientTr);
    }

    // Добавление данных из объекта в ячейки таблицы
    idTd.textContent = clientObj.id;
    fulNameTd.textContent = `${clientObj.surname} ${clientObj.name} ${clientObj.lastname}`;
    createdAtTd.textContent = clientObj.createdAt;
    updatedAtTd.textContent = clientObj.updatedAt;
    contactsTd.textContent = clientObj.contacts;
    actionTd.append(changeBtn, removeBtn);
    changeBtn.textContent = "Изменить";
    changeBtn.classList.add('btn', 'btn-change');
    removeBtn.textContent = "Удалить";
    removeBtn.classList.add('btn', 'btn-reset');

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
    // Отрисовка списка после сортировки
    return renderClientsList(sortArr);
  }

  // Start. 

  // первоначальный массив пользователей 
  let clientsList = [];
  // Проверка наличия данных на 
  clientsList = await checkLocalServer();


  // Создание статичных элементов html и загрузка интерактивных элементов в JS
  const openFormBtn = document.getElementById('addClientBtn');
  let filterRequest = document.getElementById('filterRequest');

  // Загрузка модального окна "Новый клиент" в JS
  const modalNewForm = document.getElementById('formNewClient');
  const addNewBtn = document.getElementById('addContactBtn');
  const saveClientBtn = document.getElementById('saveClientBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  let surnameNewInp = document.getElementById('newSurname');
  let nameNewInp = document.getElementById('newName');
  let lastnameNewInp = document.getElementById('newLastname');

  // открытие модального окна "Новый клиент"
  openFormBtn.addEventListener("click", function () {
    modalNewForm.classList.add("modal-parent--open");
    surnameNewInp.value = '';
    nameNewInp.value = '';
    lastnameNewInp.value = '';
  })

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