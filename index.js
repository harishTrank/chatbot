const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const { database } = require("./config/keys");
const http = require("http").Server(app);
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(routes);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
const socketMessaging = require("./socket/message");
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("combined"));

mongoose.set("useCreateIndex", true);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected!"))
  .then(() => {
    const PORT = process.env.PORT || 5000;
    http.listen(PORT, console.log("Server Started on port"));
    socketMessaging(io);
  })
  .catch((err) => console.log(err));
