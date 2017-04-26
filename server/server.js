const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static('public'))

io.on('connection', socket => {
  console.log('New user connected')

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

server.listen(8079)