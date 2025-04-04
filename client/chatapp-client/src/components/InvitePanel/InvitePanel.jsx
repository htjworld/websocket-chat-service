import React, { useEffect, useState } from "react";
import "./InvitePanel.css";

const InvitePanel = ({ isOpen, roomId, members, onClose, socket }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
        socket.emit("getAllUsers", null, (res) => {
          if (!res?.ok) return;
    
          const filtered = res.users.filter(
            (u) => !members.some((m) => m._id === u._id)
          );
          setAllUsers(filtered.sort((a, b) => a.name.localeCompare(b.name)));
        });
      }
    }, [isOpen, members, socket]);

  const toggleSelect = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = () => {
    if (selected.length === 0) return alert("한 명 이상 선택해주세요!");
  
    socket.emit("inviteUsers", { roomId, userIds: selected }, (res) => {
      if (res.ok) {
        alert("유저를 성공적으로 초대했습니다!");
        setSelected([]);
        onClose();
      } else {
        alert(`초대 실패: ${res.message}`);
      }
    });
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="invite-panel">
      <h3>초대할 유저 선택</h3>
      <input
        type="text"
        placeholder="이름 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="invite-user-list">
        {filteredUsers.map((user) => (
          <li key={user._id} className="invite-user-item">
            <label className="invite-user-label">
            <input
                type="checkbox"
                checked={selected.includes(user._id)}
                onChange={() => toggleSelect(user._id)}
            />
            <span className="invite-user-name">{user.name}</span>
            </label>
        </li>
        ))}
      </ul>
      <div className="invite-buttons">
        <button onClick={handleInvite}>초대하기</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default InvitePanel;