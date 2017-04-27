const socket = io()

const form = document.getElementById('message-form')
const messageList = document.getElementById('message-list')

form.addEventListener('submit', e => {
  e.preventDefault()

  let getTextInput = document.getElementsByName("message")[0]

  socket.emit('createMessage', {
    from: 'User',
    text: getTextInput.value
  })

  getTextInput.value = ''
})

socket.on('newMessage', ({ from, text }) => {
  messageList.innerHTML += `<li>${from}: ${text}</li>`
})  