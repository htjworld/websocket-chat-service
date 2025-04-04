import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import CreateRoomPage from "./pages/CreateRoomPage/CreateRoomPage";


function App() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    socket.on("message", (message) => {
      console.log("res", message);
    });
    
    // useEffect 안에 추가
    socket.on("rooms", (res) => {
      setRooms(res);
    });
    socket.on("roomsUpdated", () => {
      socket.emit("getRooms", null, (res) => {
        if (res?.ok) {
          setRooms(res.data);
        }
      });
    });
    // 로그인 요청
    askUserName();

    return () => {
      socket.off("message");
      socket.off("rooms");
      socket.off("roomsUpdated");
    };
  }, []);
  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요");

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data);
        setRooms(res.rooms);
      }else{
        alert("로그인 실패: " + res.error);
      }
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<RoomListPage rooms={rooms} />} />
        <Route exact path="/room/:id" element={<ChatPage user={user} />} />
        <Route exact path="/create-room" element={<CreateRoomPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
