const express = require('express');
const app =  express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
const { Script } = require('vm');




app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req,res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

// the userid and roomid is pass from the Script.js in the clint room page

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)


        socket.on('disconnect', () =>{
            socket.to(roomId).broadcast.emit('user-disconnect', userId)
        })
    })
})


server.listen(3000);