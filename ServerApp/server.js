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
  currentPositions: [],
  isRecording: false,
};

app.use(cors());

io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  socket.emit("recording status update", state.isRecording);
  socket.emit("current positions update", state.currentPositions);

  socket.on("message", (message) => {
    io.emit("position message", JSON.parse(message));

    if (state.isRecording) {
      recordMessage(message);
    }
  });
});

const recordMessage = (message) => {
  try {
    const jsonMessage = JSON.parse(message);

    db.insertPosition(
      jsonMessage.lat,
      jsonMessage.lon,
      jsonMessage.heading,
      state.newestTrackId
    );

    state.currentPositions.push(jsonMessage);
  } catch (err) {
    if (!err instanceof SyntaxError) {
      haltRecording();
      throw err;
    }
  }
};

const haltRecording = () => {
  this.isRecording = false;
  io.emit("recording status update", false);
};

// const broadcastToAllButSender = (socketId) => {
//   for (socket of io.sockets.sockets) {
//     console.log(socket[0]);

//     if (socket[0] !== socketId) {
//       io.to(socket[0]).emit("recording status update", state.isRecording);
//     }
//   }
// };

app.post("/record/start", (req, res) => {
  if (!state.isRecording) {
    try {
      state.newestTrackId = uuidv4();
      db.insertTrack(state.newestTrackId);

      state.isRecording = true;

      res.sendStatus(204);
      io.emit("recording status update", true);
      console.log("success: recording STARTED");

      io.emit("current positions update", state.currentPositions);
    } catch (err) {
      haltRecording();
      res.sendStatus(500);
      throw err;
    }
  } else {
    res.sendStatus(400);
    console.error("bad request: a recording was already running");
  }
});

app.post("/record/stop", (req, res) => {
  if (state.isRecording) {
    state.isRecording = false;

    res.sendStatus(204);
    io.emit("recording status update", false);
    console.log("success: recording ENDED");

    io.emit("current positions update", state.currentPositions);

    state.currentPositions = [];
  } else {
    haltRecording();
    res.sendStatus(400);
    console.error("bad request: no running recording");
  }
});

app.get("/tracks", (req, res) => {
  db.getTracks()
    .then((results) => {
      res.send({ tracks: results.rows });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/track/:id", (req, res) => {
  const id = req.params.id;

  db.getPositionsByTrackId(id)
    .then((results) => {
      res.send({ positions: results.rows });
    })
    .catch((err) => {
      console.error(err);
    });
});

const PORT = 5678 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
