import React, { useState } from "react";
import { Layout, Card, Avatar, Button, Input, Modal } from 'antd';

const { Header, Content } = Layout;
const { confirm } = Modal;

const MyDashboard = () => {
  const username = 'John Doe';
  const coins = 100;
  const stories = [
    { text: 'Story 1', coinsEarned: 20 },
    { text: 'Story 2', coinsEarned: 30 },
    { text: 'Story 3', coinsEarned: 50 },
  ];

  const [storyBetTopic, setStoryBetTopic] = useState("");
  const [showModal, setShowModal] = useState(false);


  function handleClearStories() {
    confirm({
      title: "Are you sure you want to clear all stories?",
      onOk() {
        // clearStories();
      },
      onCancel() {},
    });
  }

  function handleChangeTopic(value) {
    setStoryBetTopic(value);
  }

  function handleSaveTopic() {
    // TODO: Save the new topic to the database
    setShowModal(false);
  }

  const isUserAdmin = true;

  return (
    <>
        <Layout>
            <Content style={{ padding: '50px' }}>
                <Card style={{ borderRadius: '15px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
                <Avatar size={64} style={{ backgroundColor: '#87d068' }}>
                    {username.charAt(0)}
                </Avatar>
                <h2 style={{ marginTop: '10px' }}>{username}</h2>
                <p style={{ marginBottom: '0px' }}>
                    Coins: <strong>{coins}</strong>
                </p>
                </Card>
                <h2 style={{ marginTop: '20px' }}>My Stories</h2>
                {stories.map((story) => (
                <Card key={story.text} style={{ marginTop: '10px',  borderRadius: '15px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ marginBottom: '0px' }}>
                    Story: <strong>{story.text}</strong>
                    </p>
                    <p style={{ marginBottom: '0px' }}>
                    Coins earned: <strong>{story.coinsEarned}</strong>
                    </p>
                </Card>
                ))}
                {isUserAdmin && (
                    <>
                    <br/>
                    <Button onClick={handleClearStories}>
                        Clear All Stories
                    </Button>
                    <br />
                    <br />
                    <Button type="primary" onClick={() => setShowModal(true)}>
                        Change StoryBet Topic
                    </Button>
                    <Modal
                        title="Change StoryBet Topic"
                        visible={showModal}
                        onOk={handleSaveTopic}
                        onCancel={() => setShowModal(false)}
                    >
                        <Input
                        placeholder="Enter new topic"
                        value={storyBetTopic}
                        onChange={(e) => handleChangeTopic(e.target.value)}
                        />
                    </Modal>
                    </>
            )}
            </Content>
        </Layout>
    </>
  );
};

export default MyDashboard;
