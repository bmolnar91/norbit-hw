require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const { v4: uuidv4 } = require("uuid");
const db = require("./queries");

// Handling state on the server as a temporary (?) solution
const state = {
  newestTrackId: null,
  isRecording: false,
  recordedPositions: [],
};

app.use(cors());

io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  io.emit("recordingStatusMessage", state.isRecording);

  io.emit("recordedPositionsMessage", state.recordedPositions);

  socket.on("message", (message) => {
    handleMessage(message);
    io.emit("position message", JSON.parse(message));
  });
});

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

      state.recordedPositions.push(jsonMessage);
    } catch (err) {
      if (!err instanceof SyntaxError) {
        throw err;
      }
    }
  }
};

app.post("/record/start", (req, res) => {
  if (!state.isRecording) {
    try {
      state.newestTrackId = uuidv4();
      db.insertTrack(state.newestTrackId);

      state.isRecording = true;

      res.sendStatus(204);
      io.emit("recordingStatusMessage", state.isRecording);
      console.log("success: recording STARTED");
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  } else {
    res.sendStatus(400);
    console.log("bad request: a recording was already running");
  }
});

app.post("/record/stop", (req, res) => {
  if (state.isRecording) {
    state.isRecording = false;

    res.sendStatus(204);
    io.emit("recordingStatusMessage", state.isRecording);
    console.log("success: recording ENDED");

    state.recordedPositions = [];
  } else {
    res.sendStatus(400);
    console.log("bad request: no running recording");
  }
});

const PORT = 5678 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
