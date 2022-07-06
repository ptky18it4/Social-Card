const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

const server = http.createServer(app);
const io = socketIo(server);
const getApiAndEmit = "TODO";

//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// route
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// Start socket.io
// End socket.io
app.listen(8800, () => {
  console.log(`Backend server is running! http://192.168.0.119:8800/api/`);
});
