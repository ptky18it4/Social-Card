import axios from "axios";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../../constants/constants";
const Test = () => {
  useEffect(() => {
    const getPosts = async () => {
      const response = await axios.get(`${API_URL}/posts`);
      const postsData = response.data;
      console.log("GET-DATA: ", postsData);
    };

    getPosts();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connnection", () => {
      console.log("connected to server");
    });

    socket.on("FromAPI", (posts) => {
      console.log("EMIT-SOCKET: ", posts);
    });

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnecting");
    });
  }, []);
  return <div>OK</div>;
};

export default Test;
