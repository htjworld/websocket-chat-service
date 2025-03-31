const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const Room = require("./Models/room");
const roomRouter = require("./routes/roomRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/room", roomRouter);

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

//임의의 room
app.get("/", async (req, res) => {
  try {
    const existing = await Room.findOne({room : "전체 공지 방"});
    if (!existing) {
      await Room.create({ room: "전체 공지 방", members: [] });
      return res.send("전체 공지 방 created");
    } else {
      return res.send("전체 공지 방 already exists");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = app;
