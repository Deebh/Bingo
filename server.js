const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 8000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// const secureKey = 9211 ;
// Socket 
const io = require('socket.io')(http)


// store player names : (must be unique)
const players = []
var turn = 0
io.on('connection', (socket) => {
    console.log('A user connected ...');

    socket.on('user-data',(username)=>{
        console.log(username + ' joined ');

        players.push(username);
        console.log(players);

        socket.broadcast.emit('user-data',username) ;
    })

    // event for broadcasting clicked cell data to everyone :
    socket.on('cell-data',(value)=>{
        console.log("User clicked : " + value);
        socket.broadcast.emit('cell-data',value) ;
    })

    socket.on('disconnect',()=>{
        console.log('A user disconnected ...');

       players = []
        // socket.broadcast.emit('user-data',username,'disconnect') ;

    })

    // control players turns :
    socket.on('turn',(t)=>{
        // console.log(players);
        turn = t%players.length ;
        console.log("Move : " + players[turn]);
        socket.emit('turn',(players[turn]));
    })
   

    socket.on('winner',(username)=>{
        console.log(username + "wins");
        socket.emit('winner',username) ;
    })
    // socket.on('message', (msg) => {
    //     console.log(msg);
    //     socket.broadcast.emit('message', msg)
    // })

})
