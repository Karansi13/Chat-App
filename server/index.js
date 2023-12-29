const http = require("http")
const express = require("express")
const cors = require("cors")
const socketIO = require("socket.io")

const app = express()

const port = 4500 || process.env.port;

const users=[{}]; // array of objects

app.use(cors()); // cors is used for inter communication between url
app.get("/", (req, res) => {
    res.send("hello")
})

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
    console.log("New connection")

    socket.on('joined',({ user })=> {
        users[socket.id] = user;   // Every socket has an unique id
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined', {user:"Admin", message: `${users[socket.id]} has joined`}); 
        // broadcast means everyone will get the message except the one who has just joined the chat
        socket.emit('welcome', {user: "Admin", message: `Welcome to the chat, ${users[socket.id]}`})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('Disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
    //   console.log(`user left`);
  })

})


server.listen(port, ()=>{
    console.log(`server is working on http://localhost:${port}`);
})