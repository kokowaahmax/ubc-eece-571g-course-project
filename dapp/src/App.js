// node requirements
import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { ethers } from 'ethers';
import { Layout, Menu, Button } from "antd";
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AppRouter } from './AppRouter';


// import ABI code to interact with the smart contract
// import contract from './artifacts/contracts/Lock.sol/Lock.json'

// react component
import MessageList from "./components/MessageList"
import MessageForm from "./components/MessageForm"
import TitleCard from './components/TitleCard';

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const { Header, Content, Footer } = Layout;


function App() {

  const [messages, setMessages] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );

  function addMessage(newMessage) {
    setMessages([...messages, { ...newMessage, id: Date.now() }]);
  }

  const handleClickMenuItem = (e) => {
    setCurrentMenuItem(e.key);
  };

   return (
    <AppRouter basename='/'>
      <div>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Link to='/' style={{ marginRight: 8 }}>Story Board</Link>
                <Link to='/dashboard'>My Dashboard</Link>
              </div>
              <div>
                <Button style={{ marginRight: 8 }}>Connect Wallet</Button>
                <Button>Buy Token</Button>
              </div>
            </div>
          </Header>
          <Content
          style={{ padding: "10px 50px", marginTop: 80, alignItems: 'center'}}
          >
            <TitleCard />
            <MessageForm addMessage={addMessage} />
            <MessageList messages={messages} />
          </Content>
          <Footer style={{ textAlign: "center" }}>EECE571G © WT2022/2023 Project Group 5 </Footer>
        </Layout>
      </div>
    </AppRouter>
  );
}

export default App;
