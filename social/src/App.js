import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllPostAsync, revertItemDeleted } from "./features/posts/postSlice";
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
function Menu() {
  const dispatch = useDispatch();

  const handleRevert = () => {
    dispatch(revertItemDeleted());
  };

  return (
    <div className="option">
      <button className="btn btn-revert" onClick={handleRevert}>
        Revert
      </button>
      <Link to="/new">
        <button className="btn btn-addnew">Add New</button>
      </Link>
      <div class="input-group">
        <div class="form-outline">
          <input
            type="search"
            id="form1"
            class="form-control"
            placeholder="Search"
          />
        </div>
        <button type="button" class="btn btn-primary"></button>
      </div>
    </div>
  );
}
