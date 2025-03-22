const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const chat = require("../Models/chat");
const user = require("../Models/user");
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
        const welcomeMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: "system" },
        };
        io.emit("message", welcomeMessage);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });        
      }
    });

    socket.on("sendMessage", async (message, cb) => {
      try {
        // 유저 찾기(socket.id로)
        const user = await userController.checkUser(socket.id);
        // 메세지 저장
        const newMessage = await chatController.saveChat(message, user);
        io.emit("message", newMessage);
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });
  });
};
