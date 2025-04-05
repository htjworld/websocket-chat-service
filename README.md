# 🛠 Websocket Chat Service

A full-stack real-time messenger app using Socket.IO, MongoDB, and React, with a KakaoTalk-inspired UI.  
실시간 채팅, 유저 초대, 방 관리 기능을 포함한 **카카오톡 스타일 UI**의 **풀스택 웹소켓 기반 메신저 프로젝트**입니다.

---

## 📌 Features

### ✅ Core Features
- 실시간 채팅 (Socket.IO 기반)
- 방 생성, 초대, 퇴장 기능
- 시스템 메시지 (type: system) 전송 및 DB 저장
- 유저 기반 권한 제어 (방장만 초대 가능)
- 방별 채팅 기록 (입장 시점 이후만 표시)
- 초대 시 실시간 리스트 반영

📄 기능 명세서, ERD, API 명세서 등 자세한 문서화 자료는 아래 Notion 링크에서 확인하실 수 있습니다:  
🔗 [websocket-chat-service-notion](https://www.notion.so/websocket-chat-service-1c5c43250534802ab75bea63f1db1cae?pvs=4)

---

### 🧩 Frontend (React)
- React 기반 컴포넌트 구조화
- 상태 관리: `useState`, `useEffect`, socket 이벤트 처리
- 실시간 갱신 반영: 채팅, 유저 초대, 방 목록 자동 반영
- 초대창, 사이드패널, 메시지 UI 등 구성 완료
- 채팅 스크롤 영역 UX 개선 (스크롤 하단 패딩, 오버플로우 처리 등)

---

### ⚙ Backend (Node.js + Express + MongoDB)
- Socket.IO로 실시간 통신 처리
- MongoDB + Mongoose 기반의 데이터 모델링
- User, Room, Chat 스키마 설계 및 연관관계 구축
- 방/유저 관리 로직 모듈화 (`roomController`, `userController`)
- 초대 및 퇴장 시 메시지 저장 및 브로드캐스트 처리
- 사용자 인증은 `socket.id`로 관리

---

## 🧱 Tech Stack

| 영역       | 사용 기술                                |
|------------|-------------------------------------------|
| **Frontend** | React, React Router DOM, CSS               |
| **Backend**  | Node.js, Express, Socket.IO               |
| **Database** | MongoDB, Mongoose                         |
| **Dev Tools**| Nodemon                                  |

---


## 🧑‍💻 Folder Structure

### Backend

```text
server/
├── Controllers/
│   ├── chat.controller.js
│   ├── room.controller.js
│   └── user.controller.js
├── Models/
│   ├── chat.js
│   ├── room.js
│   └── user.js
├── utils/
│   └── io.js         # WebSocket 서버 핵심 로직
├── index.js          # 서버 진입점 (Express + Socket.IO 연결)
├── app.js            # Express 서버 설정 및 미들웨어 구성
```

### Frontend

```text
client/chatapp-client/src
├── components/
│   ├── ChatSidePanel/
│   ├── CreateRoomButton/
│   ├── InputField/
│   ├── InvitePanel/
│   └── MessageContainer/
├── pages/
│   ├── ChatPage/
│   ├── CreateRoomPage/
│   └── RoomListPage/
├── App.js            # 라우터 및 페이지 컴포넌트 구성
├── index.js          # React 진입점 (DOM에 App 렌더링)
├── server.js         # 클라이언트 측 Socket.IO 연결 설정
```

---

## 🔐 Planned Enhancements (TODO)

- 기존 [**Spring Boot Board (SBB)**](https://github.com/htjworld/javaspringbootsbb) 프로젝트를 중심으로  
  본 메신저 기능을 연동 및 통합할 예정:
  - Spring Security 기반 로그인 통합
  - 세션/토큰 인증 처리 (JWT 또는 세션 방식 고려)
- 채팅방 읽음 표시 기능
- 메시지 삭제 및 수정 기능
- 관리자(방장) 권한 강화: 방 강퇴, 권한 위임 등

---

## 💡 How to Run

### Backend

```bash
cd server
npm install  # 최초 1회만 실행
nodemon index.js
```

### Frontend

```bash
cd client/chatapp-client
npm install  # 최초 1회만 실행
npm start
```

.env 설정이나 DB URI가 필요할 경우 따로 환경변수를 설정해주세요.
