import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import CreateRoomPage from "./pages/CreateRoomPage/CreateRoomPage";


function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [rooms, setRooms] = useState([]);

  console.log("message List", messageList);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("res", message);
      setMessageList((prevState) => prevState.concat(message));
    });
    // 틀자마자 실행
    askUserName();
    // useEffect 안에 추가
    socket.on("rooms", (res) => {
      console.log("rooms from socket",res);
      setRooms(res);
    });
  }, []);
  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요");

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data);
      }
    });
  };
  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage res", res);
    });
  };
  // return (
  //   <div>
  //     <div className="App">
  //       <MessageContainer messageList={messageList} user={user} />
  //       <InputField
  //         message={message}
  //         setMessage={setMessage}
  //         sendMessage={sendMessage}
  //       />
  //     </div>
  //   </div>
  // );
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
