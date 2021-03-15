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

app.use(cors());

io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  socket.on("message", (message) => {
    handleMessage(message);
    io.emit("position message", message);
  });

  // socket.on("recordingStatusMessage", (message) => {
  //   handleRecordingStatusMessage(message);
  // });

  // socket.on("testMessage", (message) => {
  //   console.log("TEST MESSAGE CAME THROUGH");
  // });
});

// const handleRecordingStatusMessage = (message) => {
//   if (message === "start") {
//     state.isRecording = true;
//     state.newestTrackId = uuidv4();

//     db.insertTrack(state.newestTrackId);
//   } else if (message === "stop") {
//     state.isRecording = false;
//   }
// };

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

app.post("/record/start", (req, res) => {
  if (!state.isRecording) {
    try {
      state.newestTrackId = uuidv4();
      db.insertTrack(state.newestTrackId);

      state.isRecording = true;

      res.sendStatus(204);
      console.log("success: recording started");
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
    console.log("success: recording ended");
  } else {
    res.sendStatus(400);
    console.log("bad request: no running recording");
  }
});

const PORT = 5678 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
