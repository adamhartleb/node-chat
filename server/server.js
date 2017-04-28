const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 8079

const { getNewMsg, genLocationMsg } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')
const users = new Users()

app.use(express.static(publicPath))

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
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

  socket.on('createMessage', msg => {
    const user = users.getUser(socket.id)
    if (user && isRealString(msg.text)) {
      io.to(user.room).emit('newMessage', getNewMsg(user.name, msg.text))
    }
  })

  socket.on('createLocationMessage', ({ lat, lng }) => {
    const user = users.getUser(socket.id)
    if (user) {
      io.to(user.room).emit('newLocationMessage', genLocationMsg(user.name, {lat, lng}))
    }
  })

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', getNewMsg('Admin', `${user.name} has left`))
    }
  })
})

server.listen(port)