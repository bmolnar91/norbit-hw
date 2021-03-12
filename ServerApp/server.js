require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
  },
});
const { v4: uuidv4 } = require("uuid");
const db = require("./queries");

// Handling state on the server as a temporary solution
const state = {
  newestTrackId: null,
  isRecording: false,
};

io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  socket.on("message", (message) => {
    handleMessage(message);
    io.emit("position message", message);
  });

  socket.on("recordingStatusMessage", (message) => {
    handleRecordingStatusMessage(message);
  });
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

const PORT = 5678 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
