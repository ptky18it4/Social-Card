import "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { SOCKET_URL } from "./constants/constants";
import "./css/app.css";
import "./css/app.css.map";
import {
  getAllPostAsync,
  getPostByIdAsync,
  getStateAsync,
} from "./features/api/ActionPostAsync";
import Main from "./features/posts/Main";
function App() {
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    dispatch(getAllPostAsync());
    dispatch(getStateAsync());
  }, [dispatch]);

  const socket = io(SOCKET_URL);
  useEffect(() => {
    socket.on("connnection", () => {
      console.log("connected to server");
    });

    socket.on("post-created", (posts) => {
      console.log("[EMIT] - [ADD]: ", posts);
      dispatch(getAllPostAsync());
    });

    socket.on("post-updated", (posts) => {
      console.log("[EMIT] - [UPDATE]: ", posts);
      dispatch(getAllPostAsync());
    });

    socket.on("post-deleted", (responsse) => {
      console.log("[EMIT] - [DELETED]: ", responsse);
      dispatch(getAllPostAsync());
    });
    socket.on("revert-added", (responsse) => {
      dispatch(getAllPostAsync());
    });
    socket.on("revert-deleted", (responsse) => {
      dispatch(getAllPostAsync());
    });

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnecting");
    });
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="wrapper">
          <Main />
        </div>
      </div>
    </div>
  );
}

export default App;
