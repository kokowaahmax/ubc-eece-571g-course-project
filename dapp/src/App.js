// node requirements
import logo from './logo.svg';
import './App.css';
import React,  { useState, useEffect }from "react";
import { ethers } from 'ethers';
import { Layout, Button, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Link, Routes, Route  } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import isEqual from 'lodash/isEqual';


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
        if (stories.length != _initStories.length) {
          setStories(_initStories);
        }
      }
    }

    init();
  }, [provider, signer, storyBet, stories]);

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
        console.log("create");
        console.log(newStory);
        setStories(prevStories => [...prevStories, newStory]);
      };

      storyBet.on(eventFilter, handleStoryAdded);

      return () => {
        storyBet.off(eventFilter, handleStoryAdded);
      };
    }
  }, [storyBet]);

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
        console.log("vote");
        console.log(newStory);
        console.log(stories);
        console.log(parseInt(ethers.utils.formatUnits(newStory.publishedDateTime,0)));
        const storyIndex = stories.findIndex((s) => parseInt(ethers.utils.formatUnits(s.publishedDateTime,0)) === parseInt(ethers.utils.formatUnits(newStory.publishedDateTime,0)));
        const story = { ...stories[storyIndex] }; 
        console.log(storyIndex);
        console.log(story);
        console.log(story.numVote);
        story.numVote = parseInt(newStory.numVote.toString(), 10);
        console.log(story.numVote);
        
        //console.log(stories[1]);
         // Create a new array with the updated story object
        const updatedStories = [...stories];
        updatedStories[storyIndex] = story;
      
        const sortedStories = [...updatedStories].sort((a, b) => b.votes - a.votes);
      // Update the state with the new array
        setStories(sortedStories);
      };

      storyBet.on(eventFilter2, handleStoryAdded2);

      return () => {
        storyBet.off(eventFilter2, handleStoryAdded2);
      };
    }
  }, [storyBet]);

  function addStory(newStory) {
    storyBet.createStory([`${newStory.author}`], ["title1"], Date.now(), newStory.text);
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
                {/* <Button icon={<ShoppingCartOutlined/>}>Buy Token</Button> */}
                <BuyTokenButton storyBet={storyBet}/>
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
                <StoryList stories={stories} setStories={setStories} storyBet={storyBet}/>
              </>} />
              <Route path='/dashboard' element={
                <>
                  <MyDashboard signer={signer} storyBet={storyBet}/>
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