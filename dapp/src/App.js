// node requirements
import './App.css';
import React,  { useState, useEffect }from "react";
import { ethers, BigNumber } from 'ethers';
import { Layout, Button, message } from "antd";
import { UserOutlined } from '@ant-design/icons';


// import ABI code to interact with the smart contract
import StoryBet from './artifacts/contracts/StoryBet.sol/StoryBet.json'

// react component
import StoryList from "./components/StoryList"
import StoryForm from "./components/StoryForm"
import TitleCard from './components/TitleCard';
import MyDashboard from './components/MyDashboard'
import BuyTokenButton from './components/BuyTokenButton';

const { Header, Content, Footer } = Layout;
// TODO: input your contract address
const storyBetAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [storyBet, setStoryBet] = useState();
  const [stories, setStories] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [topic, setTopic] = useState('Welcome to StoryBet! Are you ready to put your creativity to the test? We challenge you to write a short story with at most 100 characters, starting with "I love to eat carbonara so much". The twist? The story should be unexpected and unique. The story with the most votes at the end of the competition will win all the coins in the pool. So what are you waiting for? Let us start writing!');

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
        storyBetAddress,
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

      if (_storyBet) {
        const _initStories = await _storyBet.getStories();
        setStories(_initStories);
      }
    }

    init();
  }, [provider, signer, storyBet]);

  useEffect(() => {
    if (storyBet) {
      const eventFilter = storyBet.filters.StoryAdded();

      const handleStoryAdded = async (
        ownerAddress,
        numVote,
        tags,
        storyTitle,
        publishedDateTime,
        storyText,
        comments,
        exist) => {
        const newStory = { 
          ownerAddress,
          numVote,
          tags,
          storyTitle,
          publishedDateTime,
          storyText,
          comments,
          exist };
        setStories(prevStories => [...prevStories, newStory]);
      };

      storyBet.on(eventFilter, handleStoryAdded);

      return () => {
        storyBet.off(eventFilter, handleStoryAdded);
      };
    }
  }, [storyBet, stories]);

  useEffect(() => {
    if (storyBet) {
      const eventFilter2 = storyBet.filters.StoryAdded2();

      const handleStoryAdded2 = async (
        ownerAddress,
        numVote,
        tags,
        storyTitle,
        publishedDateTime,
        storyText,
        comments,
        exist) => {
        const newStory = { 
          ownerAddress,
          numVote,
          tags,
          storyTitle,
          publishedDateTime,
          storyText,
          comments,
          exist };
         // Create a new array with the updated story object
        const updatedStories = stories.map((s) => {
        if (s.publishedDateTime.toNumber() === newStory.publishedDateTime.toNumber()) {
          return newStory;
        } else {
          return s;
        }
        }).sort((a, b) => b.numVote.toNumber() - a.numVote.toNumber());
      // Update the state with the new array
        setStories(updatedStories);
      };

      storyBet.on(eventFilter2, handleStoryAdded2);

      return () => {
        storyBet.off(eventFilter2, handleStoryAdded2);
      };
    }
  }, [storyBet, stories]);

  async function addStory(newStory) {
    try {
      await storyBet.createStory([`${newStory.author}`], [`${topic}`], Date.now(), newStory.text);
    } catch (error) {
      message.error("Can't submit a story. Do you have enough coins?");
    }
  }

  const handleClickMenuItem = (text) => {
    console.log(`switch menu item to ${text}`)
    setCurrentMenuItem(text);
  };

   return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <Button style={{ marginRight: 8 }} onClick={() => handleClickMenuItem('storyBoard')}> 
                Story Board
              </Button>
              <Button onClick={() => handleClickMenuItem('dashboard')}>
                My Dashboard
              </Button>
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
              <BuyTokenButton storyBet={storyBet}/>
            </div>
          </div>
        </Header>
        <Content
        style={{ padding: "10px 50px", marginTop: 80, alignItems: 'center'}}
        >
          {currentMenuItem === "dashboard" ? (
            <>
              <MyDashboard signer={signer} storyBet={storyBet} topic={topic} setTopic ={setTopic}/>
            </>
          ) : (
            <>
              <TitleCard topic={topic}/>
              <StoryForm addStory={addStory} provider={provider} storyBet = {storyBet} />
              <StoryList stories={stories} setStories={setStories} storyBet={storyBet}/> 
            </>
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>EECE571G © WT2022/2023 Project Group 5 </Footer>
      </Layout>
    </div>
  );
}

export default App;