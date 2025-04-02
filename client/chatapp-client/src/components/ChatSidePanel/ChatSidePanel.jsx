import React from "react";
import "./ChatSidePanel.css";

const ChatSidePanel = ({ onLeaveRoom, onInviteClick, members, isOpen }) => {
  return (
    <div className={`chat-side-panel ${isOpen ? "open" : "closed"}`}>
      <h3>방 정보</h3>

      <div className="side-section">
        <h4>멤버 목록</h4>
        <ul className="member-list">
          {members.map((member) => (
            <li key={member._id}>{member.name}</li>
          ))}
        </ul>
      </div>

      <div className="side-section">
        <button onClick={onInviteClick} className="invite-button">
          초대하기
        </button>
        <button onClick={onLeaveRoom} className="leave-button">
          나가기
        </button>
      </div>
    </div>
  );
};

export default ChatSidePanel;