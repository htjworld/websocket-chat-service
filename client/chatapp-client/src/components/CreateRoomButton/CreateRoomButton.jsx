// components/CreateRoomButton/CreateRoomButton.jsx
import React from "react";
import "./CreateRoomButton.css";

const CreateRoomButton = ({ onClick }) => {
  return (
    <button className="create-room-button" onClick={onClick}>
      + 방 만들기
    </button>
  );
};

export default CreateRoomButton;