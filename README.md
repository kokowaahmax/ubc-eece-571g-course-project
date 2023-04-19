# StoryBet: A Decentralized Web Application for Story Creation and Betting on the Blockchain

StoryBet is an online story creation and betting platform built on the blockchain, developed as a decentralized web application (DAPP) by Project Group 5 from the EECE 571G course project group. With StoryBet, users can write short stories of up to 1000 characters each week and put their stories in a story pool for other participants to vote on. At the end of each week, the story with the highest vote count wins all the votes (or "coins") from the pool. Users can also comment on stories they like, creating a vibrant community of story creators and readers.

StoryBet aims to provide an innovative solution that encourages creativity, critical thinking, and engagement with literature and storytelling, in contrast to simply watching short videos on platforms like TikTok or YouTube. The platform is built on the blockchain, providing a transparent and secure environment for users to create, share, and bet on stories. Transactions on StoryBet require users to pay gas fees, but the potential prize of winning all the coins, which are convertible to ethers, serves as a motivating factor for users.

The StoryBet DAPP consists of a frontend written in ReactJS with the Ant Design (Antd) package for styling, and a backend implemented in Solidity and deployed locally in a development environment using Hardhat. The development process followed a Test-Driven Development (TDD) approach, with comprehensive test cases written for each method utilized in the smart contract to ensure a robust backend.

As a project group with a passion for blockchain technologies and software engineering, our future plans for StoryBet include deploying the application to a testnet and expanding the user base beyond our immediate circle of colleagues and friends. We are excited about the potential of StoryBet to revolutionize the way people engage with literature and storytelling online, and we aim to contribute to society by providing a unique and engaging platform for story creation and betting on the blockchain.This is the team course project for EECE 571G of our team in WT2 2022/2023

## current versions
`nvm use 18`
npm -> 9.5.1
node.js -> v18.14.2

## requirements

- install node.js, npm, nvm, reactJs, hardhat

## run applications
- Open an extral terminal tap to start a local blockchain run `npx hardhat compile` to compile the contract file and generate the ABI code, which will store in the './src/artifacts' of your local file tree

- Run `npx hardhat node` to generate a local node of hardhat and hardhat will generate 20 users with ETHs in the terminal, please mark that down.

- Open another terminal tap and deploy the smart contract to your local hardhat network by running `npx hardhat run scripts/deploy.js --network localhost`, the contract address should appear and please mark that down.

- replace the contract address in `app.js`

- Open a terminal tap and run the command of `npm run start` to start the frontend reactJS application




