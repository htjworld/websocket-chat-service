const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must type name"],
    unique: true,
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
  // 참여 중인 방 목록 + 입장 시간
  joinedRooms: [
    {
      room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  // 자신이 만든 방 목록 (방장 권한용)
  adminRooms: [{ type: mongoose.Schema.ObjectId, ref: "Room" }],
});
module.exports = mongoose.model("User", userSchema);
