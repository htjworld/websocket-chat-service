const Room = require("../Models/room");

const roomController = {};
roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

roomController.joinRoom = async (roomId, user) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("해당 방이 없습니다.");
  }
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }
  user.room = roomId;
  await user.save();
};

roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room);
  if (!room) {
    throw new Error("Room not found");
  }
  room.members.remove(user._id);
  await room.save();
};


module.exports = roomController;
