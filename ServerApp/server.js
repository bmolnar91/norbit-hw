const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 5678 || process.env.PORT;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  socket.on("message", (message) => {
    console.log(message);

    io.emit("position message", message);
  });

  io.emit("test", "Test message!");
});

app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
