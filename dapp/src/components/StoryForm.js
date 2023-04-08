import React, { useState } from "react";
import { Input, Button, Card } from 'antd';
const { TextArea } = Input;
// import { ethers } from 'ethers';
// import StoryBet from '../artifacts/contracts/StoryBet.sol/StoryBet.json'

function StoryForm({ addStory, provider, StoryBet }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    // addStory({ text, author });
    // setText("");
    // setAuthor("");
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(contractAddress, StoryBetABI.abi, signer);
    StoryBet.createStory(["tag1"], ["title1"], Date.now(), text);
    

    // addStory({ text, author });
    // setText("");
    // setAuthor("");
    
  }

  return (
    <Card style={{ borderRadius: '15px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <form onSubmit={handleSubmit} 
    style={{ display: 'flex', flexDirection: 'column' }}>
      <Input
        placeholder="Author name"
        style={{ marginBottom: '10px' }}
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <TextArea
        placeholder="Type up to 1000 characters here..."
        maxLength={1000}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {/* <button type="submit">Send</button> */}
      <Button htmlType="submit" type="primary" 
      style={{ marginTop: '10px', alignSelf: 'flex-end'}}>
        Send
      </Button>
    </form>
    </Card>
  );
}

export default StoryForm;
