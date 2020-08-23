const express = require('express')()
const http = require('http').Server(express)
const cors = require('cors')
const io = require('socket.io')(http)
const PORT = process.env.PORT || 5000

express.use(cors())

io.on('connection', socket => {
    socket.on('joinGame', data => {
        socket.join(data)
        console.log(`user has joined room:  ${data}`)
        io.in(data).clients((error, clients) => {
            if (error)
                throw error
            else {
                if (clients.length === 1) {
                    socket.emit('initHost', data)
                }
                if (clients.length === 2) {
                    io.in(data).emit('startGame', data)
                }
            }
        })
    })
    socket.on('updateGameState', (room, state) => {
        socket.broadcast.to(room).emit('updateView', state)
    })
    socket.on('updateBoard', (room, board) => {
        socket.broadcast.to(room).emit('updateBoard', board)
    })
    socket.on('switchPlayerTurn', (room) => {
        socket.broadcast.to(room).emit('switchPlayer')
    })
    socket.on('nextTurn', (room) => {
        io.in(room).emit('nextTurn')
    })
    socket.on('gameOver', (room, color) => {
        io.in(room).emit('gameOver', color)
    })
    socket.on('restart', (room) => {
        io.in(room).emit('restart')
    })
    socket.on('playerLeft', (room, name) => {
        socket.broadcast.to(room).emit('playerLeft', name)
    })
    socket.on('sendGuestName', (room, name) => {
        socket.to(room).emit('receiveGuestName', name)
    })
    socket.on('waiting', (room) => {
        socket.to(room).emit('waiting')
    })
    socket.on('sendHostName', (room, name) => {
        io.in(room).emit('receiveHostName', name)
    })
    socket.on('disconnecting', () => {
        console.log('disconnecting', socket.rooms)
    })
    socket.on('disconnect', () => {
        console.log(socket.rooms)
    })
})

http.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})
