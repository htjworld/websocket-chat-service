const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const Room = require("./Models/room");
const app = express();
app.use(cors());

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

//임의의 room
app.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    if (rooms.length === 0) {
      await Room.insertMany([
        { room: "자바스크립트 단톡방", members: [] },
        { room: "리액트 단톡방", members: [] },
        { room: "NodeJS 단톡방", members: [] },
      ]);
      return res.send("room created");
    } else {
      return res.send("rooms already exist");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = app;
