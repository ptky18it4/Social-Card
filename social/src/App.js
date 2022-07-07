import "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import "./css/app.css";
import "./css/app.css.map";
import { getAllPostAsync, getStateAsync } from "./features/api/ActionPostAsync";
import Main from "./features/posts/Main";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllPostAsync());
    dispatch(getStateAsync());
  }, [dispatch]);
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
