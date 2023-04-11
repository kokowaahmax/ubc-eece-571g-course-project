import React, { useState, useEffect  } from "react";
import { Layout, Card, Avatar, Button, Input, Modal, message, InputNumber } from 'antd';
import { BigNumber } from 'ethers';

const { Content } = Layout;
const { confirm } = Modal;

const MyDashboard = ({signer, storyBet, topic, setTopic}) => {

  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState("");
  const [poolBalance, setPoolBalance] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [refundVoteNum, setRefundVoteNum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [isUserAdmin, setUserAdmin] = useState(false);

  function handleRefundTokenClick() {
    setIsModalOpen(true);
  }

  async function handleModalCancel() {
    setIsModalOpen(false);
  }

  async function handleModalOk() {
    setIsModalOpen(false);
    try {
      const transaction = await storyBet.refundVote(refundVoteNum);
      await transaction.wait();
      message.success("Your refund has submitted!");
    } catch (error) {
      message.error("Can't refund! Do you have enough balance left in storyBet?");
    }
  }


  useEffect(() => {
    const loadUserData = async () => {
      const addr = await signer.getAddress();
      const userVoteBalance = await storyBet.getUserVote(addr);
      const userStories = await storyBet.getAllUserStories(addr);
      const adminAddress = await storyBet.getAdmin();
      const newPoolBalance = await storyBet.getBalance();
      setUsername(addr);
      setBalance(userVoteBalance.toString());
      setUserStories(userStories);
      setUserAdmin(adminAddress === addr);
      setPoolBalance(newPoolBalance.toString());
    };
    loadUserData();
  }, [signer, storyBet, isUserAdmin]);

  async function handleClearStories() {
    confirm({
      title: "Are you sure you want to clear all stories?",
      async onOk() {
        await storyBet.summaryVotes();
      },
      onCancel() {},
    });
  }

  function handleChangeTopic(value) {
    setTopic(value);
  }

  function handleSaveTopic() {
    // TODO: Save the new topic to the database
    setShowModal(false);
  }

  return (
    <>
        <Layout>
            <Content style={{ padding: '50px' }}>
            <Card style={{ borderRadius: '15px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center' }}>
              <Avatar size={64} style={{ backgroundColor: '#0055B7' }}>
                {username.slice(0, 4)}
              </Avatar>
              <div style={{ marginLeft: '20px' }}>
                <h2 style={{ marginTop: '10px' }}>{username}</h2>
                <div>
                  <p>
                    Coins: <strong>{balance / 10**17}</strong> = {balance} wei
                  </p>
                  <div style={{float: 'right'}}>
                    <Button onClick={handleRefundTokenClick}>Refund Token</Button>
                  </div>
                  <Modal
                    title="Refund Tokens"
                    open={isModalOpen}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                  >
                    <p>Please enter the number of tokens to refund:</p>
                    <InputNumber min={0} max={balance / 10**17} onChange={setRefundVoteNum} />
                  </Modal>
                </div>
              </div>
            </Card>
                <h2 style={{ marginTop: '20px' }}>My Stories</h2>
                {userStories.map((story) => (
                <Card key={story.publishedDateTime} 
                      style={{ 
                        marginTop: '10px',  
                        borderRadius: '15px', 
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                        // Use a grayed-out color when story.exist is false
                        backgroundColor: story.exist ? '#FFFFFF' : '#ECECEC',
                        opacity: story.exist ? 1 : 0.5, // Adjust the opacity when story.exist is false
                      }}>
                    <p style={{ marginBottom: '0px' }}>
                    Story Topic: <strong>{story.storyTitle}</strong>
                    </p>
                    <p style={{ marginBottom: '0px' }}>
                    Story: <strong>{story.storyText}</strong>
                    </p>
                    <p style={{ marginBottom: '0px' }}>
                    Number of votes: <strong>{BigNumber.from(story.numVote).toNumber()}</strong>
                    </p>
                    <p style={{ marginBottom: '0px' }}>
                    Date of creation: <strong>{new Date(BigNumber.from(story.publishedDateTime).toNumber()).toDateString()}</strong>
                    </p>
                </Card>
                ))}
                {isUserAdmin && (
                    <>
                    <br/>
                    <Card style={{ marginTop: '10px',  borderRadius: '15px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', backgroundColor: 'orange' }}>
                    <h2 style={{ marginTop: '20px' }}>Admin Area</h2>
                    <h3>Current StoryBet Balance: <strong>{poolBalance / 10**17}</strong> coins = {poolBalance} wei</h3>
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
                        open={showModal}
                        onOk={handleSaveTopic}
                        onCancel={() => setShowModal(false)}
                    >
                        <Input
                        placeholder={topic}
                        value={topic}
                        onChange={(e) => handleChangeTopic(e.target.value)}
                        maxLength={1000}
                        style={{ 
                          marginTop: '10px',
                          width: '100%',
                          height: '50px',
                          fontSize: '16px',
                          borderRadius: '15px',
                          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                          padding: '10px',
                          boxSizing: 'border-box'
                        }}
                        />
                    </Modal>
                    </Card>
                    </>
            )}
            </Content>
        </Layout>
    </>
  );
};

export default MyDashboard;
