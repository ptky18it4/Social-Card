import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { revertItemDeleted } from "./features/posts/postSlice";
import { getAllPostAsync } from "./features/api/ActionPostAsync";
import Main from "./features/posts/Main";
import "@mui/material";
import "./App.css";
import "./css/app.css";
import "./css/app.css.map";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllPostAsync());
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
