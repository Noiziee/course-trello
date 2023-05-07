import { Modal } from 'bootstrap'
// const modalInstance = Modal.getOrCreateInstance(modalElement)
let data = []
// Helpers
function $(selector) {
  return document.querySelector(selector)
}

// Variables
const cardElement = $('#card')
const btnAddElement = $('#btnAdd')

// Init
render(data, cardElement)

// Listener
function click() {
  console.log('click')
}
btnAddElement.addEventListener('click', click)

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
    <div class="card__wrapper ${todo.bgColor}">
      <div class="card__top">
        <h2 class="card__title">title</h2>
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
      <button class="btn btn-danger">Remove</button>
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