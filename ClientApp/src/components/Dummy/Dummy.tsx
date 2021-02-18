import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SERVER_DOMAIN}`);

export const Dummy = () => {
  const [message, setMessage] = useState("Position message here");

  useEffect(() => {
    socket.on("position message", (msg: string) => {
      setMessage(msg);
    });
  }, []);

  return <p>{message}</p>;
};
