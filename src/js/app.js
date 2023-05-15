import { Todo } from './constructor'
import { clock } from './clock'
import { getUsers } from './users'
import { handleModal, modalInstance } from './modal'
import { render, renderCounters } from './render'
// bootstrap import
import { Modal } from 'bootstrap'

// Variables
let data = getData()
const todoElement = document.querySelector('#todo')
const btnAddElement = document.querySelector('#btnAdd')
const btnRemoveAllElement = document.querySelector('#btnRemoveAll')
const modalEditElement = document.querySelector('#editModal')
const modalTitleElement = document.querySelector('#modalTitle')
const modalTextareaElement = document.querySelector('#modalTextarea')
const selectColorElement = document.querySelector('#selectColor')
const selectUserElement = document.querySelector('#selectUser')
const formElement = document.querySelector('#form')
const editFormElement = document.querySelector('#editForm')
const inProgressElement = document.querySelector('#inProgress')
const doneElement = document.querySelector('#done')
const contentCountTodo = document.querySelector('#contentCountTodo')
const contentCountProgress = document.querySelector('#contentCountProgress')
const contentCountDone = document.querySelector('#contentCountDone')
const rowElement = document.querySelector('#row')
const modalEditInstance = Modal.getOrCreateInstance(modalEditElement)
// ==========Modal Edit==================================
const modalEditTitleELement = document.querySelector('#modalEditTitle')
const modalEditTextareaElement = document.querySelector('#modalEditTextarea')
const selectEditColorElement = document.querySelector('#selectEditColor')
const selectEditUserElement = document.querySelector('#selectEditUser')
const editId = document.querySelector('#editId')
const editStatus = document.querySelector('#editStatus')
const editDate = document.querySelector('#editDate')
// ================url=================================
const urlUsers = 'https://jsonplaceholder.typicode.com/users'

// Clock
setInterval(clock, 100)

// Init
render(data, todoElement, inProgressElement, doneElement)
renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)

// Listener
btnAddElement.addEventListener('click', handleModal)
formElement.addEventListener('submit', handleSubmitForm)
rowElement.addEventListener('click', handleClickDelete)
window.addEventListener('beforeunload', handleBeforeUnload)
rowElement.addEventListener('change', handleChangeStatus)
btnRemoveAllElement.addEventListener('click', handleClickRemoveAll)
rowElement.addEventListener('click', handleEditModal)
editFormElement.addEventListener('submit', handleSubmitEditForm)

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

// Main form
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
  modalInstance.hide()
  formElement.reset()
}
// Edit form =================================
function handleSubmitEditForm(event) {
  event.preventDefault()

  const title = modalEditTitleELement.value
  const description = modalEditTextareaElement.value
  const color = selectEditColorElement.value
  const user = selectEditUserElement.value
  const id = editId.value
  const date = editDate.value
  const status = editStatus.value

  data = data.filter((item) => item.id != id)
  const todo = new Todo(title, description, color, user, id, date, status)
  data.push(todo)
  render(data, todoElement, inProgressElement, doneElement)
  renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)
  modalEditInstance.hide()
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

// Remove All
function handleClickRemoveAll() {
  const messageWarning = confirm('are you sure you want to delete all todos')
  if (messageWarning) {
    data = data.filter((item) => item.status != 'done')
    render(data, todoElement, inProgressElement, doneElement)
    renderCounters(data, contentCountTodo, contentCountProgress, contentCountDone)
  }
}

// Edit Modal
function handleEditModal(event) {
  const { target } = event
  const { role } = target.dataset
  const parentNode = target.closest('.card__wrapper')
  if (role == 'edit') {
    data.forEach((item) => {
      if (item.id == parentNode.id) {
        modalEditTitleELement.value = item.title
        modalEditTextareaElement.value = item.description
        selectEditColorElement.value = item.bgColor
        selectEditUserElement.value = item.user
        editId.value = item.id
        editStatus.value = item.status
        editDate.value = item.date
      }
    })
    modalEditInstance.show()
  }
}

// length progress
function handleChangeStatus(event) {
  const { target } = event
  const { role, id } = target.dataset
  let countProgress = 0

  data.forEach((item) => {
    item.status == 'inProgress' ? countProgress++ : ''
  })

  if (role == 'select' && countProgress == 6 && target.value == 'inProgress') {
    alert('No more than 6 cases can be in this column')

    data.forEach((item) => {
      if (item.status == 'todo') {
        target.value = 'todo'
      }
      if (item.status == 'done') {
        target.value = 'done'
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

// getUsers
getUsers(urlUsers)
  .then((data) => {
    data.forEach((user) => {
      const template = `
        <option value="${user.name}">${user.name}</option>
      `
      selectUserElement.innerHTML += template

      const templateEdit = `
        <option value="${user.name}">${user.name}</option>
      `
      selectEditUserElement.innerHTML += templateEdit
    })
  })
