const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const { getNewMsg, genLocationMsg } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')
const users = new Users()

app.use(express.static('public'))

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.name)) {
      return callback('A name and room are required')
    }
    const room = params.room.toLowerCase()
    socket.join(room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, room)

    io.to(room).emit('updateUserList', users.getUserList(room))
    socket.emit('newMessage', getNewMsg('Admin', 'Welcome to the chat app!'))
    socket.broadcast.to(room).emit('newMessage', getNewMsg('Admin', `${params.name} has joined`))

    callback()
  })

  socket.on('createMessage', (msg, callback) => {
    io.emit('newMessage', getNewMsg(msg.from, msg.text))
  })

  socket.on('createLocationMessage', ({ lat, lng }) => {
    io.emit('newLocationMessage', genLocationMsg('Admin', {lat, lng}))
  })

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)
    console.log(user)
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', getNewMsg('Admin', `${user.name} has left`))
    }
  })
})

server.listen(8079)