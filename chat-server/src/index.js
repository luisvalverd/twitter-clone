const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");
dotenv.config();
const router = require("./routers/index");
require("./database");

// configs
app.set("port", process.env.PORT);

// middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: /*"http://localhost:5000"*/ "*",
    optionsSuccessStatus: 200,
  })
);
app.use(urlencoded({ extended: false }));
app.use(json());

// router
app.use("/api/chat/v1", router);

// listen
app.listen(app.get("port"), () => {
  console.log(`listen on port ${app.get("port")}`);
});
