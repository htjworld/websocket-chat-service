const User = require("../Models/user");
const Room = require("../Models/room")
const userController = {};

userController.saveUser = async (userName, sid) => {
  // 이미 있는 유저인지 확인
  const user = await User.findOne({ name: userName });
  // 없다면 새로 유저정보 만들기
  if (!user) {
    const noticeRoom = await Room.findOne({room : "전체 공지 방"});

    const newUser = new User({
      name: userName,
      token: sid,
      online: true,
      joinedRooms: [{ room: noticeRoom._id, joinedAt: new Date()}],
    });
    await newUser.save();

    noticeRoom.members.push(newUser._id);
    await noticeRoom.save();

    console.log(userName, "님의 첫 방문을 환영합니다.");
    return newUser;
  }
  // 이미 있는 유저라면 연결정보 token값만 변경
  console.log("이미 등록돼있는 ",userName)
  user.token = sid;
  user.online = true;

  await user.save();
  return user;
};

userController.checkUser = async (sid) => {
  const user = await User.findOne({ token: sid });
  if (!user) throw new Error("user not found");
  return user;
};

module.exports = userController;
