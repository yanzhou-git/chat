const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("chat-history", messages);

  socket.on("send-message", (data) => {
    const newMessage = {
      id: Date.now().toString(),
      username: data.username,
      text: data.text,
    };

    messages.push(newMessage);

    io.emit("receive-message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
