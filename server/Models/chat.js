const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chat: String,
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: String,
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
    },
    type: {
      type: String,
      enum: ["user", "system"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
