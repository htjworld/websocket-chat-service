const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const Chat = require("../Models/chat");
const User = require("../Models/user");
const Room = require("../Models/room");
const roomController = require("../Controllers/room.controller");


module.exports = function (io) {
  //io~~ => emit:듣는것, on:말하기
  io.on("connection", async (socket) => {
    socket.emit("rooms", await roomController.getAllRooms()); // 룸 리스트 보내기

    console.log("client is connected", socket.id);

    socket.on("login", async (userName, cb) => {
      //유저 정보를 저장
      try {
        const user = await userController.saveUser(userName, socket.id);
        const userRooms = await roomController.getUserRooms(user._id);
        socket.emit("rooms", userRooms);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });        
      }
    });

    socket.on("joinRoom", async (rid, cb) => {
      try {
        const user = await userController.checkUser(socket.id); // 일단 유저정보들고오기
        console.log("유저 확인", user);

        socket.join(rid); // 방 ID 직접 사용
        socket.currentRoom = rid; // 현재 방 저장

        const members = await roomController.getRoomMembers(rid);

        // const welcomeMessage = {
        //   chat: `${user.name} is joined to this room`,
        //   user: { id: null, name: "system" },
        // };
        // io.to(rid).emit("message", welcomeMessage); // 해당 방에만 전송
        io.emit("rooms", await roomController.getAllRooms());// 5 작업
        cb({ ok: true, members });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // 콜백 추가
    socket.on("getRooms", async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        const userRooms = await roomController.getUserRooms(user._id); // 유저가 속한 방만 가져오기
        socket.emit("rooms", userRooms); // 다시 프론트에 방 목록 전송
        if (cb) cb(userRooms);
      } catch (error) {
        console.error("getRooms error:", error.message);
        if (cb) cb([]);
      }
    });


    socket.on("sendMessage", async (message, cb) => {
      try {
        // 유저 찾기(socket.id로)
        const user = await userController.checkUser(socket.id);
        // 메세지 저장
        const roomId = socket.currentRoom; // socket이 기억하고 있는 현재 방

        if (!roomId) throw new Error("현재 참여 중인 방이 없습니다.");

        const newMessage = await chatController.saveChat(message, user, roomId);
        io.to(roomId).emit("message", newMessage); // 그 방에만 메시지 전달
        cb({ ok: true });
      } catch (error) {
        console.error("sendMessage 에러:", error.message);
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("leaveRoom", async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        const roomId = socket.currentRoom;
        console.log("🧩 LeaveRoom - user:", user);
        console.log("🧩 LeaveRoom - roomId:", roomId);
        if (!roomId) throw new Error("현재 방 정보가 없습니다.");

        await roomController.leaveRoom(user._id, roomId);
        const leaveMessage = {
          chat: `${user.name} left this room`,
          user: { id: null, name: "system" },
          room: roomId,
          type: "system",
        };
        await Chat.create(leaveMessage);
        socket.broadcast.to(roomId.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
        io.emit("rooms", await roomController.getAllRooms());
        socket.leave(roomId.toString()); // join했던 방을 떠남 
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    });

    socket.on("getRoomChats", async (roomId, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        // 유저가 언제 이 방에 들어왔는지 찾기
        const roomInfo = user.joinedRooms.find(
          (r) => r.room.toString() === roomId.toString()
        );

        if (!roomInfo) {
          return cb({ ok: false, message: "유저가 이 방에 참여하지 않았습니다." });
        }

        const joinedAt = roomInfo.joinedAt;

        // 입장 시점 이후의 메시지만 조회
        const chats = await Chat.find({
          room: roomId,
          createdAt: { $gte: joinedAt },
        }).sort({ createdAt: 1 });

        cb({ ok: true, chats });
      } catch (err) {
        cb({ ok: false, message: err.message });
      }
    });

    socket.on("inviteUsers", async ({ roomId, userIds }, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        const room = await Room.findById(roomId);
        if (!room) throw new Error("Room not found");
        
        if (room.admin.toString() !== user._id.toString()) {
          return cb({ ok: false, message: "방장만 유저를 초대할 수 있습니다." });
        }
        const invitedNames = [];
    
        for (const targetUserId of userIds) {
          await roomController.inviteUser(roomId, targetUserId);
          const invitedUser = await User.findById(targetUserId);
          invitedNames.push(invitedUser.name);
        }
    
        const updatedMembers = await roomController.getRoomMembers(roomId);
    
        io.to(roomId).emit("membersUpdated", updatedMembers);
    
        // 초대한 유저 이름 리스트로 시스템 메시지 전송
        if (invitedNames.length > 0) {
          const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const systemMessage = {
            chat: `${invitedNames.join(", ")}님이 입장했습니다. (${now})`,
            user: { id: null, name: "system" },
            room: roomId,
            type: "system",
          };
          await Chat.create(systemMessage);
          io.to(roomId).emit("message", systemMessage);
        }
    
        cb({ ok: true });
      } catch (err) {
        cb({ ok: false, message: err.message });
      }
    });
    socket.on("getAllUsers", async (_, cb) => {
      try {
        const users = await User.find({}, "_id name"); // 전체 유저 목록 name, _id만
        cb({ ok: true, users });
      } catch (err) {
        cb({ ok: false, message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });
  });
};
