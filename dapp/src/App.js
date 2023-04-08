// node requirements
import logo from './logo.svg';
import './App.css';
import React,  { useState, useEffect }from "react";
import { ethers } from 'ethers';
import { Layout, Button } from "antd";
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Routes, Route  } from 'react-router-dom';
import { AppRouter } from './AppRouter';


// import ABI code to interact with the smart contract
import StoryBet from './artifacts/contracts/StoryBet.sol/StoryBet.json'

// react component
import StoryList from "./components/StoryList"
import StoryForm from "./components/StoryForm"
import TitleCard from './components/TitleCard';
import MyDashboard from './components/MyDashboard'

const { Header, Content, Footer } = Layout;


function App() {
  const [storyBet, setStoryBet] = useState();
  const [stories, setStories] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    async function init() {
      const _provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await _provider.send("eth_requestAccounts", []);
      const _signer = _provider.getSigner();
      // get the contract instance
      const _storyBet = new ethers.Contract(
        // TODO: 
        'insert your contract address',
        StoryBet.abi,
        _signer
      );

      if (!provider) {
        setProvider(_provider);
      }
      if (!signer) {
        setSigner(_signer);
      }
      if (storyBet?.address !== _storyBet.address) {
        setStoryBet(_storyBet);
      }

      console.log(signer.getAddress());
      console.log(storyBet.userStory);
    }

    init();
  }, [provider, signer, storyBet]);

  function addStory(newStory) {
    storyBet.createStory([`${newStory.author}`], ["title1"], Date.now(), newStory.text);
    // setStories([...stories, { ...newStory, id: Date.now(), comments: [], votes: 0 }]);
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
                <Link to='/' style={{ marginRight: 15 }} key="storyBoard" onClick={{handleClickMenuItem}} className={currentMenuItem === "/" ? "active" : ""}>Story Board</Link>
                <Link to='/dashboard' key="dashboard" onClick={{handleClickMenuItem}} className={currentMenuItem === "/dashboard" ? "active" : ""}>My Dashboard</Link>
              </div>
              <div>
              {selectedAddress ? (
                <Button style={{ marginRight: 8 }} icon={<UserOutlined />}>
                  {selectedAddress.slice(0, 6) + "..." + selectedAddress.slice(-4)}
                </Button>
              ) : (
                <Button
                  style={{ marginRight: 8 }}
                  icon={<UserOutlined />}
                  onClick={
                  async () => {
                      try {
                        await window.ethereum.request({ method: "eth_requestAccounts" });
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        setProvider(provider);
                        const signer = provider.getSigner();
                        setSigner(signer);
                        const selectedAddress = await signer.getAddress();
                        setSelectedAddress(selectedAddress);
                      } catch (error) {
                        console.log(error);
                      }
                  }
                  }
                >
                  Connect Wallet
                </Button>
              )}
                <Button icon={<ShoppingCartOutlined/>}>Buy Token</Button>
              </div>
            </div>
          </Header>
          <Content
          style={{ padding: "10px 50px", marginTop: 80, alignItems: 'center'}}
          >
            <Routes>
              <Route path='/' element={<>
                <TitleCard />
                <StoryForm addStory={addStory} provider={provider} storyBet = {storyBet} />
                <StoryList stories={stories} setStories={setStories}/>
              </>} />
              <Route path='/dashboard' element={
                <>
                  <MyDashboard/>
                </>
              }/>
            </Routes>
          </Content>
          <Footer style={{ textAlign: "center" }}>EECE571G © WT2022/2023 Project Group 5 </Footer>
        </Layout>
      </div>
    </AppRouter>
  );
}

export default App;
