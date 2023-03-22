import React from "react";

function MessageList({ messages }) {
  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>
          <strong>{message.author}: </strong>
          {message.text}
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
