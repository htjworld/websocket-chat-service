import React, { useEffect, useState } from 'react'
import socket from "../../server";
import { Button } from "@mui/base/Button"
import MessageContainer from "../../components/MessageContainer/MessageContainer";
import InputField from "../../components/InputField/InputField";
import './ChatPageStyle.css'
import {useParams} from "react-router-dom"
import {useNavigate} from "react-router-dom"



const ChatPage = ({user}) => {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const {id} = useParams() // 유저가 조인한 방의 아이디를 url에서 가져온다.
    const navigate = useNavigate()

    
    useEffect(() => {
      socket.emit("joinRoom",id,(res)=>{
        if(res && res.ok){
            console.log("successfully join",res)
            // 기존 메시지 받아오기
            socket.emit("getRoomChats", id, (res) => {
              console.log("📦 getRoomChats 응답:", res);

              if (res.ok) {
                setMessageList(res.chats);
              } else {
                console.error("Failed to fetch previous messages:", res.message);
              }
            });
        }
        else{
            console.log("fail to join",res)
        }
      })
      

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

    const leaveRoom=()=>{
      socket.emit("leaveRoom",user,(res)=>{
          if(res.ok) navigate("/") // 다시 채팅방 리스트 페이지로 돌아감
      })
    }
    const backToList = () => {
      navigate("/"); // 방 나가진 않음, 단순히 이동
    };

    return (
      <div>
        <div className="App">
            <nav>
              <Button onClick={backToList}className='back-button'>←</Button>
              <div className='nav-user'>{user.name}</div>
            </nav>
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
}

export default ChatPage
