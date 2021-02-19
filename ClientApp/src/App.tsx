import React, { useState, useEffect } from "react";
import MapWrapper from "./components/MapWrapper/MapWrapper";
import "./App.css";

import { io } from "socket.io-client";
const socket = io(`${process.env.REACT_APP_SERVER_DOMAIN}`);

function App() {
  const [message, setMessage] = useState<string>("Position message here");
  const [incomingCoord, setIncomingCoord] = useState<number[]>();

  useEffect(() => {
    socket.on("position message", (msg: string) => {
      setMessage(msg);

      const jsonMessage = JSON.parse(msg);
      setIncomingCoord([
        parseFloat(jsonMessage.lat),
        parseFloat(jsonMessage.lon),
      ]);
    });
  }, []);

  return (
    <div className="App">
      <div className="app-label">
        <p>React Functional Components with OpenLayers</p>
        <p>{message}</p>
      </div>

      <MapWrapper incomingCoord={incomingCoord} />
    </div>
  );
}

export default App;
