require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const db = require("./queries");
const { v4: uuidv4 } = require("uuid");

// Handling state on server as a temporary solution
const state = {
  newestTrackId: null,
  isRecording: false,
};

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  socket.on("message", (message) => {
    console.log(message); // test
    io.emit("position message", message); // test

    handleMessage(message);
  });

  socket.on("recordingStatusMessage", (message) => {
    console.log(message); // test

    handleRecordingStatusMessage(message);
  });

  io.emit("test", `IO ----- ${new Date()}`); // test
  socket.emit("test", `SOCKET ----- ${new Date()}`); // test
});

const handleRecordingStatusMessage = (message) => {
  if (message === "start") {
    state.isRecording = true;
    state.newestTrackId = uuidv4();

    db.insertTrack(state.newestTrackId);
  } else if (message === "stop") {
    state.isRecording = false;
  }
};

const handleMessage = (message) => {
  if (state.isRecording) {
    try {
      const jsonMessage = JSON.parse(message);

      db.insertPosition(
        jsonMessage.lat,
        jsonMessage.lon,
        jsonMessage.heading,
        state.newestTrackId
      );
    } catch (err) {
      if (!err instanceof SyntaxError) {
        throw err;
      }
    }
  }
};

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = 5678 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
