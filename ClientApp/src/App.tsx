import React, { useState, useEffect } from "react";
import MapWrapper from "./components/MapWrapper/MapWrapper";
import "./App.css";

import { io } from "socket.io-client";
const socket = io(`${process.env.REACT_APP_SERVER_DOMAIN}`);

function App() {
  const [message, setMessage] = useState<string>("Position message here");
  const [incomingCoord, setIncomingCoord] = useState<number[]>();

  const divStyle = {
    color: "grey",
    display: "flex",
    justifyContent: "space-evenly",
  };

  useEffect(() => {
    socket.on("position message", (msg: string) => {
      setMessage(msg);
      console.log(message);

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
        <p>Boat Tracking App with OpenLayers</p>

        {incomingCoord ? (
          <div style={divStyle}>
            <p>
              <strong>latitude:</strong> {incomingCoord![0]}
            </p>
            <p>
              <strong>longitude:</strong> {incomingCoord![1]}
            </p>
          </div>
        ) : (
          <div style={divStyle}>
            <p>latitude: </p>
            <p>longitude: </p>
          </div>
        )}
      </div>

      <MapWrapper incomingCoord={incomingCoord} />
    </div>
  );
}

export default App;
