import React, { useState } from "react";
import { Input, Button, Card } from 'antd';
const { TextArea } = Input;
// import { ethers } from 'ethers';
// import StoryBet from '../artifacts/contracts/StoryBet.sol/StoryBet.json'

function StoryForm({ addStory, provider, storyBet }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (text && author) {
      addStory({ text, author });
      setText("");
      setAuthor("");
    } else {
      setText("");
      setAuthor("");
    }
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
