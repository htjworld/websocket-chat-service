const Room = require("../Models/room");
const User = require("../Models/user");

const roomController = {};

roomController.getAllRooms = async () => {
  const roomList = await Room.find({}).populate("members", "name");
  return roomList;
};

roomController.getUserRooms = async (userId) => {
  const user = await User.findById(userId).populate("joinedRooms.room");
  if (!user) throw new Error("User not found");
  const populatedRooms = user.joinedRooms.map((jr)=>jr.room);
  return populatedRooms;
};

roomController.createRoom = async (roomName, userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const newRoom = new Room({
    room: roomName,
    admin: userId,
    members: [userId],
  });

  await newRoom.save();
  user.adminRooms.push(newRoom._id);
  user.joinedRooms.push({ room: newRoom._id, joinedAt: new Date() });
  await user.save();

  return newRoom;
};

roomController.inviteUser = async (roomId, targetUserId) => {
  const room = await Room.findById(roomId);
  const user = await User.findById(targetUserId);
  if (!room || !user) throw new Error("Room or user not found");

  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }

  if (!user.joinedRooms.includes(room._id)) {
    user.joinedRooms.push(room._id);
    await user.save();
  }
};

roomController.userCanJoin = async (roomId, userId) => {
  const user = await User.findById(userId);
  if (!user) return false;
  return user.joinedRooms.includes(roomId);
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
  if (!user.joinedRooms.includes(roomId)) {
    user.joinedRooms.push(roomId);
    await user.save();
  }
};
roomController.getRoomMembers = async (roomId) => {
  const room = await Room.findById(roomId).populate("members", "name _id");
  if (!room) throw new Error("Room not found");
  return room.members;
};

roomController.leaveRoom = async (userId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  room.members = room.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );
  
  if (room.admin?.toString() === userId.toString()) {
    if (room.members.length > 0) {
      room.admin = room.members[0]; // 가장 먼저 있는 사람에게 넘기기
    } else {
      room.admin = null; // 아예 아무도 없으면 비움
    }
  }
  await room.save();

  user.joinedRooms = user.joinedRooms.filter(
    (entry) => entry.room.toString() !== roomId.toString()
  );
  user.adminRooms = user.adminRooms.filter(
    (adminRoomId) => adminRoomId.toString() !== roomId.toString()
  );
  await user.save();
  console.log(`🚪 ${user.name}(${userId}) left room '${room.room}' (${roomId})`);
};

module.exports = roomController;
