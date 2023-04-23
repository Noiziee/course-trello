import { Modal } from 'bootstrap';

// Modal======================================================================
const modalElement = document.querySelector('#exampleModal')
const addBtnElement = document.querySelector('#addBtn')
const modalInstance = Modal.getOrCreateInstance(modalElement)
modalInstance.hide()

function clickAdd() {
  modalInstance.show()
}
addBtnElement.addEventListener('click', clickAdd)

// Date===============================================================

function createAt() {
  const dateElement = document.querySelector('#watch')
  dateElement.innerHTML = new Date().toLocaleString()
}
setInterval(createAt, 1000);

// Variables
let data = []
const formInputElement = document.querySelector('#formInput')
const formTextAreaElement = document.querySelector('#formTextArea')
const formSelectColorElement = document.querySelector('#formSelectColor')
const formSelectUserElement = document.querySelector('#formSelectUser')
const btnModalSaveElement = document.querySelector('#btnModalSave')
const bannerElement = document.querySelector('#banner')
const formElement = document.querySelector('#form')

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

// Constructors
function Todo(title, description, user, bgColor) {
  this.id = new Date().getTime()
  this.title = title
  this.description = description
  this.user = user
  this.date = new Date().toISOString()
  this.bgColor = bgColor
}


// Templates

function buildTodoTemplate(todo) {
  const date = new Date(todo.date).toLocaleDateString()

  return `
    <div class="card ${todo.bgColor}">
      <div class="card__top">
        ${todo.title}
        <div class="card__top-btn">
          <button class="btn btn-primary" id="edit">edit</button>
          <button class="btn btn-secondary" id="delete">delete</button>
        </div>
      </div>
      <div class="card__body">
        <p class="card__text">${todo.description}</p>
        <select class="card__select" id="selectCard">
          <option value="inProgress">inProgress</option>
          <option value="done">done</option>
        </select>
      </div>
      <div class="card__footer">
        <p class="card__user">${todo.user}</p>
        <time class="card__date">${date}</time>
      </div>
    </div>
  `
}
// render
function render(collection, wrapper) {
  let templates = ''
  collection.forEach((item) => {
    const template = buildTodoTemplate(item)

    templates += template
  })

  wrapper.innerHTML = templates
}
