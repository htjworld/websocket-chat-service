import React, { useEffect, useState } from "react";
import socket from "../../server";
import { Button } from "@mui/base/Button";
import MessageContainer from "../../components/MessageContainer/MessageContainer";
import InputField from "../../components/InputField/InputField";
import "./ChatPage.css";
import ChatSidePanel from "../../components/ChatSidePanel/ChatSidePanel";
import InvitePanel from "../../components/InvitePanel/InvitePanel";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const ChatPage = ({ user }) => {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [invitePanelOpen, setInvitePanelOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // 전체 유저 목록
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { id } = useParams(); // 유저가 조인한 방의 아이디를 url에서 가져온다.

  const navigate = useNavigate();
  const togglePanel = () => {
    const willClose = isPanelOpen; // 이미 열려있는 상태에서 누르면 닫히니까
    setIsPanelOpen(!isPanelOpen);
  
    if (willClose) {
      // 패널 닫히는 상황이면 초대창도 같이 닫기
      setInvitePanelOpen(false);
    }
  };
  const toggleInvitePanel = () => {
    setInvitePanelOpen(!invitePanelOpen);
  };

  useEffect(() => {
    socket.emit("joinRoom", id, (res) => {
      if (res && res.ok) {
        setMembers(res.members)
        // 기존 메시지 받아오기
        socket.emit("getRoomChats", id, (res) => {
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

    
    socket.emit("getAllUsers", null, (res) => {
      if (res.ok) {
        const inviteCandidates = res.users.filter(
          (u) => !members.some((m) => m._id === u._id) && u._id !== user._id
        );
        setAllUsers(inviteCandidates);
      } else {
        console.error("유저 목록 가져오기 실패:", res.message);
      }
    });

    socket.on("membersUpdated", (updated) => {
      setMembers(updated); // ✅ ChatSidePanel 멤버 목록 갱신
  
      // ✅ 초대 대상 리스트도 갱신
      socket.emit("getAllUsers", null, (res) => {
        if (res.ok) {
          const inviteCandidates = res.users.filter(
            (u) =>
              !updated.some((m) => m._id === u._id) && u._id !== user._id
          );
          setAllUsers(inviteCandidates);
        }
      });
    });

    // 클린업 (중복 방지)
    return () => {
      socket.off("message");
      socket.off("membersUpdated");
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

  const handleInvite = () => {
    const invites = selectedUsers.map(
      (userId) =>
        new Promise((resolve) => {
          socket.emit("inviteUser", { roomId: id, targetUserId: userId }, (res) => resolve(res));
        })
    );

    Promise.all(invites).then(() => {
      setSelectedUsers([]);
      setInvitePanelOpen(false);
    });
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
        </div>
          <ChatSidePanel
            isOpen={isPanelOpen}
            members={members}
            onInviteClick={toggleInvitePanel}
            onLeaveRoom={leaveRoom}
          />
          <InvitePanel
            isOpen={invitePanelOpen}
            onClose={() => setInvitePanelOpen(false)}
            roomId={id}
            members={members}
            socket={socket}
          />

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
