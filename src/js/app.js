import { Modal } from 'bootstrap'

let data = getData()
// Helpers
function $(selector) {
  return document.querySelector(selector)
}

// Variables
const cardElement = $('#card')
const btnAddElement = $('#btnAdd')
const modalElement = $('#modal')
const btnSaveModalElement = $('#saveBtnModal')
const modalTitleElement = $('#modalTitle')
const modalTextareaElement = $('#modalTextarea')
const selectColorElement = $('#selectColor')
const selectUserElement = $('#selectUser')
const formElement = $('#form')
const inProgressElement = $('#inProgress')
const doneElement = $('#done')
const clockElement = $('#clock')
const modalInstance = Modal.getOrCreateInstance(modalElement)

// Init
render(data, cardElement)

// Listener
btnAddElement.addEventListener('click', getModal)
btnSaveModalElement.addEventListener('click', handleSubmitForm)
cardElement.addEventListener('click', handleClickDelete)
window.addEventListener('beforeunload', handleBeforeUnload)

// LocalStorage
function handleBeforeUnload() {
  setData(data)
}
function getData() {
  return JSON.parse(localStorage.getItem('data')) || []
}

function setData(source) {
  localStorage.setItem('data', JSON.stringify(source))
}

// Constructor
function Todo(title, description, bgColor, user) {
  this.id = new Date().getTime()
  this.date = new Date().toISOString()
  this.title = title
  this.description = description
  this.user = user
  this.bgColor = bgColor
}

// build
function buildTodoTemplate(todo) {
  const date = new Date(todo.date).toLocaleString()
  return `
    <div id="cardWrapper" class="card__wrapper ${todo.bgColor}">
      <div class="card__top">
        <h2 class="card__title">${todo.title}</h2>
        <span class="card__date">${date}</span>
      </div>
      <div class="card__descr">${todo.description}</div>
      <div class="card__user">${todo.user}</div>
      <select class="card__select">
        <option selected>Select status</option>
        <option value="Todo">Todo</option>
        <option value="inProgress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button class="btn btn-primary">Edit</button>
      <button class="btn btn-danger" data-role="delete">Remove</button>
    </div>
  `
}
// Handlers
function handleSubmitForm(event) {
  event.preventDefault()

  const todoTitle = modalTitleElement.value
  const todoDescription = modalTextareaElement.value
  const selectColor = selectColorElement.value
  const selectUser = selectUserElement.value
  const todo = new Todo(todoTitle, todoDescription, selectColor, selectUser)

  data.push(todo)
  render(data, cardElement)
  setData(data)
  modalInstance.hide()
  formElement.reset()
}
// Delete card
function handleClickDelete({ target }) {
  if (target.dataset.role !== 'delete') return // Проверяем если клик был НЕ по кнопке "Remove"
  const parenNode = target.closest('.card__wrapper')
  const id = Number(parenNode.id) // определяем ID
  const index = data.findIndex((card) => { card.id === id }) // Находим индекс в массиве
  data.splice(index, 1) // Удаляем из массива
  parenNode.remove() // Удаляем задачу из разметки
}

// Render
function render(collection, wrapper) {
  let templates = ''
  collection.forEach((item) => {
    const template = buildTodoTemplate(item)

    templates += template
  })
  wrapper.innerHTML = templates
}

// Modal
function getModal() {
  modalInstance.show()
}

// Clock
function clock() {
  const date = new Date().getHours()
  const date1 = new Date().getMinutes()
  clockElement.innerHTML = `${date}:${date1}`
}

setInterval(clock, 1000)