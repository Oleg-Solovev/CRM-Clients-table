
// Функция сохранения массива пользователей в LS 
function saveInLS(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

// Функция загрузки массива пользователей из LS 
function downloadFromLS(name) {
    let data = localStorage.getItem(name);
    return data ? JSON.parse(data) : [];
}

//  Функция работы с запросом в LS
function getFromLS(item = '', id = '') {
    if (item) {
        let clientsList = downloadFromLS('clientsArr');
        let newClientsList = clientsList.filter(client => client.id !== id);
        item.updatedAt = new Date();
        newClientsList.push(item);
        saveInLS('clientsArr', newClientsList);

    } else {
        let clientsList = downloadFromLS('clientsArr');
        let newClientsList = clientsList.filter(client => client.id !== id)
        saveInLS('clientsArr', newClientsList);
    };
}

//  Функция проверки списка пользователей в LS
function checkLS() {
    let clientsList = downloadFromLS('clientsArr');
    if (clientsList.length === 0) {
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
                        value: '+71234564545'
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
                name: 'Максим',
                surname: 'Петров',
                lastName: 'Иванович',
                createdAt: new Date(),
                updatedAt: new Date(),
                contacts: [
                    {
                        type: 'phone',
                        value: '+712345673636'
                    },
                    {
                        type: 'mail',
                        value: 'dfgsd@bk.ru'
                    },
                    {
                        type: 'vk',
                        value: 'https://vk.com/id20dssvdv'
                    },
                    {
                        type: 'tg',
                        value: 'https://t.me/Osdvte66'
                    }
                ]
            },
            {
                id: Math.round(Math.random() * 1000),
                name: 'Максим',
                surname: 'Сидоров',
                lastName: 'Сергеевич',
                createdAt: new Date(),
                updatedAt: new Date(),
                contacts: [
                    {
                        type: 'phone',
                        value: '+2558463155'
                    },
                    {
                        type: 'mail',
                        value: 'dfgsd@bk.ru'
                    },
                    {
                        type: 'vk',
                        value: 'https://vk.com/id20dssvdv'
                    }
                ]
            },
        ];
        // сохранение первоначального массива пользователей на сервер
        saveInLS('clientsArr', clientsList);
    }
    return clientsList
}

export {
    downloadFromLS,
    checkLS,
    getFromLS
}