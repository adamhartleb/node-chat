const socket = io()

const msgList = document.getElementById('msgList')

document.getElementById('getMsg')
  .addEventListener('click', () => {
    socket.emit('createMessage', {
      from: 'Adam',
      text: 'Hello, World!'
    })
  })

socket.on('newMessage', ({ from, text, createdAt }) => {
  msgList.innerHTML += `<li>${from} says ${text} - ${createdAt}</li>`
})

socket.on('connect', () => {
  console.log('Connected to server')
})
socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

socket.on('newMessage', message => {
  console.log(message.message)
})