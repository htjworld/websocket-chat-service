import React, { useState } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";

const MessageContainer = ({ messageList, user }) => {
  return (
    <div>
      {messageList.map((message, index) => {
        const isSystem = message.user.name === "system";
        const isMyMessage = message.user.name === user.name;
        const prevMessage = messageList[index - 1];
        const isFirstMessage = index === 0;
        const isDifferentUser =
          isFirstMessage ||
          !prevMessage ||
          prevMessage.user.name !== message.user.name;

        const time = new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <Container key={message._id} className="message-container">
            {isSystem ? (
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : isMyMessage ? (
              <div className="my-message-container">
                <span className="timestamp">{time}</span>
                <div className="my-message">{message.chat}</div>
              </div>
            ) : (
              <div className="your-message-container">
                <img
                  src="/profile.jpeg"
                  className="profile-image"
                  style={{ visibility: isDifferentUser ? "visible" : "hidden" }}
                
                />
                <div className="your-message-group">
                {isDifferentUser && (
                  <div className="message-author">{message.user.name}</div>
                )}
                <div className="message-set">
                <div className="your-message">{message.chat}</div>
                <span className="timestamp">{time}</span>
                </div>
                </div>
              </div>
            )}
          </Container>
        );
      })}
    </div>
  );
};

export default MessageContainer;
