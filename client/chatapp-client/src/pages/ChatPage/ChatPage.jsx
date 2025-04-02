import React, { useEffect, useState } from "react";
import socket from "../../server";
import { Button } from "@mui/base/Button";
import MessageContainer from "../../components/MessageContainer/MessageContainer";
import InputField from "../../components/InputField/InputField";
import "./ChatPage.css";
import ChatSidePanel from "../../components/ChatSidePanel/ChatSidePanel";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const ChatPage = ({ user }) => {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { id } = useParams(); // 유저가 조인한 방의 아이디를 url에서 가져온다.

  const navigate = useNavigate();
  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  useEffect(() => {
    socket.emit("joinRoom", id, (res) => {
      if (res && res.ok) {
        console.log("successfully join", res);
        console.log("✅ members from joinRoom:", res.members); // 추가

        setMembers(res.members)
        // 기존 메시지 받아오기
        socket.emit("getRoomChats", id, (res) => {
          console.log("📦 getRoomChats 응답:", res);

          if (res.ok) {
            setMessageList(res.chats);
          } else {
            console.error("Failed to fetch previous messages:", res.message);
          }
        });
      } else {
        console.log("fail to join", res);
      }
    });

    socket.on("message", (res) => {
      setMessageList((prevState) => prevState.concat(res));
    });

    // 클린업 (중복 방지)
    return () => {
      socket.off("message");
    };
  }, [id]);

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      if (!res.ok) {
        console.log("error message", res.error);
      }
      setMessage("");
    });
  };
  // socket.emit("getRoomMembers", id, (res) => {
  //   if (res.ok) {
  //     setMembers(res.members);
  //   } else {
  //     console.error("멤버 가져오기 실패:", res.message);
  //   }
  // });

  const leaveRoom = () => {
    const confirmLeave = window.confirm("정말 이 방에서 나가시겠습니까?");
    if (!confirmLeave) return;
  
    socket.emit("leaveRoom",  null, (res) => { 
      // 서버에서 userController.checkUser(socket.id) , socket.currentRoom 
      // 기반으로 유저와 방을 탐색
      if (res.ok) {
        socket.emit("getRooms", null, () => {
          navigate("/");
        });
      } else {
        console.log("hi");
        
        console.log(user,res)
        alert("방 나가기에 실패했습니다.");
      }
    });
  };

  const backToList = () => {
    socket.emit("getRooms", null, () => {
      navigate("/");
    });
  };

  return (
    <div>
      <div className="App">
        <div className="chat-nav">
          <nav>
            <Button onClick={backToList} className="back-button">
              ←
            </Button>
            <div className="nav-user">{user.name}</div>
          </nav>
          <Button onClick={togglePanel} className="toggle-panel-button">
            {isPanelOpen ? "X" : "☰"}
          </Button>

          <ChatSidePanel
            isOpen={isPanelOpen}
            members={members}
            onInviteClick={() => alert("초대 기능 구현 예정")}
            onLeaveRoom={leaveRoom}
          />
        </div>
        <div>
          {messageList.length > 0 ? (
            <MessageContainer messageList={messageList} user={user} />
          ) : null}
        </div>
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
