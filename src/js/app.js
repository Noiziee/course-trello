import { Modal } from 'bootstrap';


// Variables
let data = getData()
const formInputElement = document.querySelector('#formInput')
const formTextAreaElement = document.querySelector('#formTextArea')
const formSelectColorElement = document.querySelector('#formSelectColor')
const formSelectUserElement = document.querySelector('#formSelectUser')
const btnModalSaveElement = document.querySelector('#btnModalSave')
const bannerElement = document.querySelector('#banner')
const formElement = document.querySelector('#form')
// Constructors
function Todo(title, description, user, bgColor) {
  this.id = new Date().getTime()
  this.title = title
  this.description = description
  this.user = user
  this.date = new Date().toISOString()
  this.bgColor = bgColor
}

// localStorage
function getData() {
  return JSON.parse(localStorage.getItem('data')) || []
}

function setData(source) {
  localStorage.setItem('data', JSON.stringify(source))
}
function handleBeforeUnload() {
  setData(data)

}

// Templates
function buildTodoTemplate(todo) {
  const date = new Date(todo.date).toLocaleDateString()

  return `
    <div class="card ${todo.bgColor}">
      <div class="card__top">
        <h2>${todo.title}</h2>
        <time class="card__date">${date}</time>
      </div>
      <div class="card__body">
        <p class="card__text">${todo.description}</p>
      </div>
      <div class="card__user">
        <p class="card__user">${todo.user}</p>
      </div>
      <div class="card__footer">
        <select class="card__select" id="selectCard">
          <option checked>select status</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div class="card__btn">
          <button class="btn btn-primary" id="edit">edit</button>
          <button class="btn btn-danger" id="delete" data-role="delete">remove</button>
        </div>
      </div>
    </div>
  `
}
// render ========================================================
function render(collection, wrapper) {
  let templates = ''
  collection.forEach((item) => {
    const template = buildTodoTemplate(item)

    templates += template
  })

  wrapper.innerHTML = templates
}

// Modal======================================================================
const modalElement = document.querySelector('#exampleModal')
const addBtnElement = document.querySelector('#addBtn')
const modalInstance = Modal.getOrCreateInstance(modalElement)
modalInstance.hide()

function clickAddModal() {
  modalInstance.show()
}
addBtnElement.addEventListener('click', clickAddModal)

// Date===============================================================

function createAt() {
  const dateElement = document.querySelector('#watch')
  dateElement.innerHTML = new Date().toLocaleString()
}
setInterval(createAt, 1000);

// listeners
btnModalSaveElement.addEventListener('click', handleSubmitForm)
// Handlers
function handleSubmitForm(event) {
  event.preventDefault()

  const content = formInputElement.value
  const description = formTextAreaElement.value
  const selectUser = formSelectUserElement.value
  const selectColor = formSelectColorElement.value
  const todo = new Todo(content, description, selectUser, selectColor)

  data.push(todo)
  render(data, bannerElement)

  formElement.reset()
}

// удалить карточку

function handleClickDelete({ target }) {
  // Проверяем если клик был НЕ по кнопке "Х"
  if (target.dataset.role !== 'delete') return
  const parenNode = target.closest('.card')
  // определяем ID
  const id = Number(parenNode.id)
  // Находим индекс в массиве
  const index = data.findIndex((card) => { card.id === id })
  // Удаляем из массива
  data.splice(index, 1)
  // Удаляем задачу из разметки
  parenNode.remove()
}

bannerElement.addEventListener('click', handleClickDelete)

