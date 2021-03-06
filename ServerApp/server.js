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
    methods: ["GET", "POST", "DELETE"],
  },
});
const ioClient = require("socket.io-client");
const { v4: uuidv4 } = require("uuid");
const db = require("./queries");

// Handling state on the server as a temporary (?) solution
const state = {
  allClients: [],
  activeTrackId: null,
  isRecording: false,
  currentPositions: [],
};

app.use(cors());

const socketClient = ioClient(
  `${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}`
);

io.on("connection", (socket) => {
  console.log("New client connected...");
  state.allClients.push(socket);

  socket.emit("recording status update", state.isRecording);
  socket.emit("current positions update", state.currentPositions);

  socket.on("disconnect", () => {
    console.log("Client disconnected.");

    const i = state.allClients.indexOf(socket);
    state.allClients.splice(i, 1);

    console.log(state.allClients.length);

    if (!state.allClients.length && state.isRecording) {
      console.log("All clients disconnected, recording stopped.");
      haltRecording();
    }
  });
});

socketClient.on("message", (message) => {
  io.emit("position message", JSON.parse(message));

  if (state.isRecording) {
    recordMessage(message);
  }
});

const recordMessage = (message) => {
  try {
    const jsonMessage = JSON.parse(message);

    db.insertPosition(
      jsonMessage.lat,
      jsonMessage.lon,
      jsonMessage.heading,
      state.activeTrackId
    ).then(() => {
      state.currentPositions.push(jsonMessage);
    });
  } catch (err) {
    if (!err instanceof SyntaxError) {
      haltRecording();
      throw err;
    }
  }
};

const haltRecording = () => {
  state.isRecording = false;
  state.currentPositions = [];
  io.emit("recording status update", false);
  io.emit("current positions update", []);
};

// Currently unused
const broadcastToAllButSender = (socketId) => {
  for (socket of io.sockets.sockets) {
    console.log(socket[0]);

    if (socket[0] !== socketId) {
      io.to(socket[0]).emit("recording status update", state.isRecording);
    }
  }
};

app.post("/record/start", (req, res) => {
  if (!state.isRecording) {
    try {
      state.activeTrackId = uuidv4();
      db.insertTrack(state.activeTrackId).then(() => {
        state.isRecording = true;

        res.sendStatus(204);
        io.emit("recording status update", true);
        io.emit("current positions update", state.currentPositions);
      });
    } catch (err) {
      haltRecording();
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
    console.error("bad request: a recording is already running");
  }
});

app.post("/record/stop", (req, res) => {
  if (state.isRecording) {
    state.isRecording = false;

    res.sendStatus(204);
    io.emit("recording status update", false);
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

app.get("/tracks/:id", (req, res) => {
  const id = req.params.id;

  db.getPositionsByTrackId(id)
    .then((results) => {
      res.send({ positions: results.rows });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.delete("/tracks/:id", (req, res) => {
  const id = req.params.id;

  db.deleteTrack(id)
    .then(() => {
      db.getTracks().then((results) => {
        res.send({ tracks: results.rows });
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(400);
    });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
