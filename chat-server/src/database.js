const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { HOST_DATABASE, PORT_DATABASE } = process.env;
const URI = `mongodb://${HOST_DATABASE}:${PORT_DATABASE}/chat`;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("database is connected"))
  .catch((err) => console.log(err));
