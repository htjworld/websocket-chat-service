const User = require("../Models/user");
const userController = {};

userController.saveUser = async (userName, sid) => {
  // 이미 있는 유저인지 확인
  const user = await User.findOne({ name: userName });
  // 없다면 새로 유저정보 만들기
  if (!user) {
    const newUser = new User({
      name: userName,
      token: sid,
      online: true,
    });
    console.log(userName, "님의 첫 방문을 환영합니다.");
    await newUser.save();
    return newUser;
  }
  // 이미 있는 유저라면 연결정보 token값만 변경
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
