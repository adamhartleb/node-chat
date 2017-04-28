const socket = io()

const form = document.getElementById('message-form')
const messageList = document.getElementById('message-list')
const locationBtn = document.getElementById('send-location')
const userList = document.getElementById('users')

form.addEventListener('submit', e => {
  e.preventDefault()
  const params = getParams(window.location.search)
  let getTextInput = document.getElementsByName("message")[0]
  getTextInput.value = getTextInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  socket.emit('createMessage', {
    from: `${params.name}`,
    text: getTextInput.value
  })

  getTextInput.value = ''
})

locationBtn.addEventListener('click', function () {
  if (!navigator.geolocation) return alert('Geolocation not supported on your browser')
  this.disabled = true
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
    this.disabled = false
  }, () => {
    alert('Unable to fetch location.')
  })
})

function scrollToBottom () {
  const messages = document.getElementsByClassName('message')
  const newMessage = messages[messages.length - 1].clientHeight
  const totalMessageHeight = messages.length * newMessage
  const clientHeight = window.innerHeight

  if (totalMessageHeight >= clientHeight) {
    console.log(messageList.scrollTop)
    messageList.scrollTop = totalMessageHeight
  }
}

socket.on('connect', function () {
  const params = getParams(window.location.search)

  socket.emit('join', params, err => {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      console.log('No error')
    }
  })
})

socket.on('updateUserList', function (users) {
  users.forEach(user => {
    userList.innerHTML += `<li>${user}</li>`
  })
})

socket.on('newLocationMessage', ({ from, url, createdAt }) => {
  const formattedTime = moment(createdAt).format('h:mm a')
  messageList.innerHTML += `<li class='message'><div class='message__title'><h4>${from}</h4><span>${formattedTime}</span></div>
  <div class='message__body'><p><a target='_blank' href='${url}'>My current location</a></p></div></li>`
  scrollToBottom()
})

socket.on('newMessage', ({ from, text, createdAt }) => {
  const formattedTime = moment(createdAt).format('h:mm a')
  messageList.innerHTML += `<li class='message'><div class='message__title'><h4>${from}</h4><span>${formattedTime}</span></div>
  <div class='message__body'><p>${text}</p></div></li>`
  scrollToBottom()
})  