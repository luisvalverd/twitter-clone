const { Schema, model } = require("mongoose");

const Users = new Schema({
  socket_id: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
  },
});

module.exports = model("Users", Users);
