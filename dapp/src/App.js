import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import MessageList from "./components/MessageList"
import MessageForm from "./components/MessageForm"

function App() {

  const [messages, setMessages] = useState([]);

  function addMessage(newMessage) {
    setMessages([...messages, { ...newMessage, id: Date.now() }]);
  }

   return (
    <div>
      <MessageList messages={messages} />
      <MessageForm addMessage={addMessage} />
    </div>
  );
}

export default App;
