const express = require("express");
const app = express();
const http = require('http'); // exist in all nodejs apps
const cors = require('cors'); //library
const {Server} = require("socket.io"); // imports class Server from socket io library

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",//tells socket io server which URL will be making requests
        methods: ["GET", "POST"] //only accepts these requests
    }
});

io.on("connection", (socket) => {//detecs if someone connects to socket server
    console.log(`User Connected : ${socket.id}`); //when someone opens a website, they a unique id

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user with id: ${socket.id} joined room ${data}`)
    });
    socket.on("send_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message", data)
    });

    socket.on("disconnect", () => { //when someone closes tab
        console.log("User Disconnected", socket.id);
    })
})

server.listen(3001, () => {
    console.log("SERVER RUNNING");
})