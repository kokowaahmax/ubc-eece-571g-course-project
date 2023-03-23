// node requirements
import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { ethers } from 'ethers';

// import ABI code to interact with the smart contract
import contract from './artifacts/contracts/Lock.sol/Lock.json'

// react component
import MessageList from "./components/MessageList"
import MessageForm from "./components/MessageForm"

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

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
