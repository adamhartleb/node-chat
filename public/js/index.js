const socket = io()

const form = document.getElementById('message-form')
const messageList = document.getElementById('message-list')
const locationBtn = document.getElementById('send-location')

form.addEventListener('submit', e => {
  e.preventDefault()

  let getTextInput = document.getElementsByName("message")[0]
  getTextInput.value = getTextInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  socket.emit('createMessage', {
    from: 'User',
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

socket.on('newLocationMessage', ({ from, url, createdAt }) => {
  const formattedTime = moment(createdAt).format('h:mm a')
  messageList.innerHTML += `<li><b>${from}</b> ${formattedTime}: <a target='_blank' href='${url}'>My current location</a></li>`
})

socket.on('newMessage', ({ from, text, createdAt }) => {
  const formattedTime = moment(createdAt).format('h:mm a')
  messageList.innerHTML += `<li><b>${from}</b> ${formattedTime}: ${text}</li>`
})  