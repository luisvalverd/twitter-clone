const { Schema, model } = require("mongoose");

const Messages = new Schema({
  emitter: {
    type: String,
    required: true,
  },
  reciver: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date_message: {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
});

module.exports = model("Messages", Messages);
