const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const { getNewMsg, genLocationMsg } = require('./utils/message')

app.use(express.static('public'))

io.on('connection', socket => {
  socket.emit('newMessage', getNewMsg('Admin', 'Welcome to the chat app!'))
  socket.broadcast.emit('newMessage', getNewMsg('Admin', 'A new user joined'))

  socket.on('createMessage', (msg, callback) => {
    io.emit('newMessage', getNewMsg(msg.from, msg.text))
  })

  socket.on('createLocationMessage', ({ lat, lng }) => {
    io.emit('newLocationMessage', genLocationMsg('Admin', {lat, lng}))
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

server.listen(8079)