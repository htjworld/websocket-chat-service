import React, { useEffect, useState } from "react";
import socket from "../../server";
import { useNavigate } from "react-router-dom";
import "./RoomListPage.css";
import CreateRoomButton from "../../components/CreateRoomButton/CreateRoomButton";

const RoomListPage = ({rooms}) => {
  
  const navigate = useNavigate();

  const moveToChat = (rid) => {
    navigate(`/room/${rid}`);
  };

  return (
    <div className="room-body">
      <div className="room-nav">채팅 ▼</div>

      <CreateRoomButton onClick={() => navigate("/create-room")} />

      {rooms.length > 0
        ? rooms.map((room) => (
            <div
              className="room-list"
              key={room._id}
              onClick={() => moveToChat(room._id)}
            >
              <div className="room-title">
                <img src="/profile.jpeg" />
                <p>{room.room}</p>
              </div>
              <div className="member-number">{room.members ? room.members.length : 0}</div>
            </div>
          ))
        : null}
    </div>
  );
};

export default RoomListPage;

