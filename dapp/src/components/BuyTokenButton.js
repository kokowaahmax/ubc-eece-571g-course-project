import { useState } from 'react';
import { Button, Modal, InputNumber, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';

function BuyTokenButton({storyBet}) {
  const [numVotes, setNumVotes] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBuyToken = () => {
    setModalVisible(true);
  }

  const handleOk = () => {
    setModalVisible(false);
    initiatePayment();
  }

  const handleCancel = () => {
    setModalVisible(false);
  }

  const initiatePayment = async () => {
    if (typeof window.ethereum !== 'undefined') {
      // Request account access if needed
      await window.ethereum.enable();

      // Calculate the total amount to be paid
      const votePrice = ethers.utils.parseEther('0.1');
      const amount = ethers.BigNumber.from(numVotes).mul(votePrice);
      // Send the transaction to the contract
      try {
        const transaction = await storyBet.buyVote(numVotes, {
          value: amount
      });
      message.success("Your coins order is submitted!")
      const receipt = await transaction.wait();
      console.log(receipt);
      } catch (error) {
        message.error("Something went wrong!");
      }
    } else {
      // User doesn't have MetaMask installed or not logged in
      alert('Please install MetaMask or log in to your account.');
    }
  }

  return (
    <>
      <Button icon={<ShoppingCartOutlined />} onClick={handleBuyToken}>Buy Coins</Button>
      <Modal
        title="Buy Coins"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <InputNumber
          min={1}
          max={10}
          defaultValue={1}
          onChange={value => setNumVotes(value)}
        />
      </Modal>
    </>
  );
}

export default BuyTokenButton;