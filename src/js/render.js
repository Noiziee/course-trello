import { buildTodoTemplate, buildTemplateTodo, buildTemplateProgress, buildTemplateDone } from "./template"

// Render
function render(data, todoColumn, progressColumn, doneColumn) {
  let todoTemplates = ''
  let inProgressTemplates = ''
  let doneTemplates = ''
  data.forEach((item) => {
    const template = buildTodoTemplate(item)

    item.status == 'todo' ? todoTemplates += template : ''
    item.status == 'inProgress' ? inProgressTemplates += template : ''
    item.status == 'done' ? doneTemplates += template : ''
  })

  todoColumn.innerHTML = todoTemplates
  progressColumn.innerHTML = inProgressTemplates
  doneColumn.innerHTML = doneTemplates
}

// Render count
function renderCounters(collection, todoCount, inProgressCount, doneCount) {
  let todo = 0
  let inProgress = 0
  let done = 0

  collection.forEach((item) => {
    item.status == 'todo' ? todo++ : ''
    item.status == 'inProgress' ? inProgress++ : ''
    item.status == 'done' ? done++ : ''
  })

  const templateTodo = buildTemplateTodo(todo)
  const templateProgress = buildTemplateProgress(inProgress)
  const templateDone = buildTemplateDone(done)

  todoCount.innerHTML = templateTodo
  inProgressCount.innerHTML = templateProgress
  doneCount.innerHTML = templateDone
}

export { render, renderCounters }