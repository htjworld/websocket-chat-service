const express = require("express");
const router = express.Router();
const roomController = require("../Controllers/room.controller");
const userController = require("../Controllers/user.controller");

// 방 생성 API (프론트에서 요청 받기)
router.post("/create", async (req, res) => {
  console.log("Create Room 요청:", req.body);
  const { roomName, adminId } = req.body;
  try {
    const newRoom = await roomController.createRoom(roomName, adminId);
    res.status(201).json({ ok: true, room: newRoom });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

// 모든 유저 리스트 (초대용)
router.get("/users", async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
