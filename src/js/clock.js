// Clock
const clockElement = document.querySelector('#clock')

function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}
function clock() {
  const hours = new Date().getHours()
  const minutes = new Date().getMinutes()
  clockElement.innerHTML = `${hours}:${padTo2Digits(minutes)}`
}

export { clock }