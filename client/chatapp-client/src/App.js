import { useEffect } from "react";
import "./App.css";
import socket from "./server";

function App() {

  const askUserName=()=>{
    useEffect(()=>{ // 틀자마자 실행
      askUserName()
    },[])
    const userName = prompt("당신의 이름을 입력하세요");
    console.log("uuu",userName)

    socket.emit("login",userName,(res)=>{
        console.log("Res",res);
        
    })
  }
  return (
    <div>
      <div className="App"></div>
    </div>
  );
}

export default App;
