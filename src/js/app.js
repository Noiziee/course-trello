import { Modal } from 'bootstrap'

let data = getData()
// Helpers
function $(selector) {
  return document.querySelector(selector)
}

// Variables
const todoElement = $('#todo')
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
const contentCountTodo = $('#contentCountTodo')
const contentCountProgress = $('#contentCountProgress')
const contentCountDone = $('#contentCountDone')
const rowElement = $('#row')
const modalInstance = Modal.getOrCreateInstance(modalElement)


// Init
render(data, todoElement, inProgressElement, doneElement)
renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)

// Listener
btnAddElement.addEventListener('click', getModal)
btnSaveModalElement.addEventListener('click', handleSubmitForm)
rowElement.addEventListener('click', handleClickDelete)
window.addEventListener('beforeunload', handleBeforeUnload)
rowElement.addEventListener('change', handleChangeStatus)

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
  this.status = 'Todo'
}

// build
function buildTodoTemplate(todo) {
  const date = new Date(todo.date).toLocaleString()
  const statusTodo = todo.status == 'Todo' ? 'selected' : ''
  const statusInProgress = todo.status == 'inProgress' ? 'selected' : ''
  const statusDone = todo.status == 'Done' ? 'selected' : ''
  return `
    <div id="cardWrapper" class="card__wrapper ${todo.bgColor}">
      <div class="card__top">
        <h2 class="card__title">${todo.title}</h2>
        <span class="card__date">${date}</span>
      </div>
      <div class="card__descr">${todo.description}</div>
      <div class="card__user">${todo.user}</div>
      <select class="card__select" data-role="select" data-id="${todo.id}">
        <option selected>Select status</option>
        <option value="Todo" ${statusTodo}>Todo</option>
        <option value="inProgress" ${statusInProgress}>inProgress</option>
        <option value="Done" ${statusDone}>Done</option>
      </select>
      <button class="btn btn-primary">Edit</button>
      <button class="btn btn-danger" data-role="delete" data-id="${todo.id}">Remove</button>
    </div>
  `
}
// Сounter drawing
function buildTemplateTodo(countTodo) {
  return `
    <h2 class="content__title">Todo</h2>
    <span>${countTodo}</span>
  `
}
function buildTemplateProgress(countProgress) {
  return `
    <h2 class="content__title">In Progress</h2>
    <span>${countProgress}</span>
  `
}
function buildTemplateDone(countDone) {
  return `
    <h2 class="content__title">Done</h2>
    <span>${countDone}</span>
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
  render(data, todoElement, inProgressElement, doneElement)
  renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)
  setData(data)
  modalInstance.hide()
  formElement.reset()
}
// Delete card
function handleClickDelete(event) {
  const { target } = event
  const { role, id } = target.dataset

  if (role == 'delete') {
    data = data.filter((item) => item.id != id) // исключаю из массива удаляемую todo
    render(data, todoElement, inProgressElement, doneElement)
    renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)
  }
}

// Render
function render(data, todoColumn, progressColumn, doneColumn) {
  let todoTemplates = ''
  let inProgressTemplates = ''
  let doneTemplates = ''
  data.forEach((item) => {
    const template = buildTodoTemplate(item)
    if (item.status == 'Todo') {
      todoTemplates += template
    }
    if (item.status == 'inProgress') {
      inProgressTemplates += template
    }
    if (item.status == 'Done') {
      doneTemplates += template
    }
  })
  todoColumn.innerHTML = todoTemplates
  progressColumn.innerHTML = inProgressTemplates
  doneColumn.innerHTML = doneTemplates
}

// Modal
function getModal() {
  modalInstance.show()
}

// Clock
function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}
function clock() {
  const hours = new Date().getHours()
  const minutes = new Date().getMinutes()
  clockElement.innerHTML = `${hours}:${padTo2Digits(minutes)}`
}
setInterval(clock, 100)

// Render count
function renderCounters(collection, todoCount, inProgressCount, doneCount) {
  let todo = 0
  let inProgress = 0
  let done = 0

  collection.forEach((item) => {
    if (item.status == 'Todo') {
      todo++
    }

    if (item.status == 'inProgress') {
      inProgress++
    }

    if (item.status == 'Done') {
      done++
    }
  })

  const templateTodo = buildTemplateTodo(todo)
  const templateProgress = buildTemplateProgress(inProgress)
  const templateDone = buildTemplateDone(done)

  todoCount.innerHTML = templateTodo
  inProgressCount.innerHTML = templateProgress
  doneCount.innerHTML = templateDone
}

// length progress
function handleChangeStatus(event) {
  const { target } = event
  const { role, id } = target.dataset
  let countProgress = 0

  data.forEach((item) => {
    if (item.status == 'inProgress') {
      countProgress++
    }
  })

  if (role == 'select' && countProgress == 6 && target.value == 'inProgress') {
    alert('No more than 6 cases can be in this column')

    data.forEach((item) => {
      if (item.status == 'Todo') {
        target.value = 'Todo'
      }
      if (item.status == 'Done') {
        target.value = 'Done'
      }
    })
    return
  } else if (role == 'select') {
    data.forEach((item) => {
      if (item.id == id) {
        item.status = target.value
      }
    })
    render(data, todoElement, inProgressElement, doneElement)
    renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)
  }
}
