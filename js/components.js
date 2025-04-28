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

export {
  createEl,
  createInput,
  getDateFormat,
  getTimeFormat
}