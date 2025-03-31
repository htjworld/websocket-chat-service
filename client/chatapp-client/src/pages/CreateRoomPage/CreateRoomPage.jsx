import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../server";
import "./CreateRoomPage.css";

const CreateRoomPage = ({ user }) => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/room/create", {
        roomName,
        adminId: user._id,
      });
      if (res.data?.ok) {
        alert("방이 생성되었습니다.");
        socket.emit("getRooms");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("방 생성 실패");
    }
  };

  return (
    <div className="create-room-container">
      <h2>새로운 방 만들기</h2>
      <form onSubmit={createRoom}>
        <input
          type="text"
          placeholder="방 이름"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button type="submit">방 만들기</button>
      </form>
    </div>
  );
};

export default CreateRoomPage;