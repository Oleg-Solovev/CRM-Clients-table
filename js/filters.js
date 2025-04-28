import {clientsList, renderClientsList} from "./main.js"

// Запуск функции поиска-фильтра
$('#filterRequest').on('keyup', debounce(filterClients, 3000));

// Функция фильтра поискового запроса
export function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
}

// функция фильтрации таблицы по запросу
export function filterClients() {
    const text = filterRequest.value;
    const filterArr = clientsList.filter(el =>
        el.name.toLowerCase().includes(text.toLowerCase())
        || el.surname.toLowerCase().includes(text.toLowerCase())
        || el.lastName.toLowerCase().includes(text.toLowerCase())
        || el.id == text
    )
    return renderClientsList(filterArr);
}