const { Schema, model } = require("mongoose");

const Chat = new Schema({
  users: [String],
  group: {
    required: true,
    type: Boolean,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
});

module.exports = model("ChatMessages", Chat);
