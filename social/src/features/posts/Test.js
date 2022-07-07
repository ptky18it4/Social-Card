import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { SOCKET_URL } from "../../constants/constants";
const Test = () => {
  const [response, setResponse] = useState("");
  useEffect(() => {
    const socket = socketIOClient(`${SOCKET_URL}`);
    socket.on("FromAPI", (data) => {
      setResponse(data);
    });
  }, []);
  return (
    <div>
      <h1>
        It's <span dateTime={response}>{response}</span>
      </h1>
    </div>
  );
};

export default Test;
