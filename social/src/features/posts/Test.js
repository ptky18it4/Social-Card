import React from "react";
import socketClient from "socket.io-client";
import { API_URL } from "../../constants/constants";
const Test = () => {
  var socket = socketClient(API_URL);
  socket.on("connection", () => {
    console.log(`I'm connected with the back-end`);
  });
  return (
    <div>
      <h1>TEST</h1>
    </div>
  );
};

export default Test;
