# ubc-eece-571g-course-project
This is the team course project for EECE 571G of our team in WT2 2022/2023

## current versions
`nvm use 18`
npm -> 9.5.1
node.js -> v18.14.2

## requirements

- install node.js, npm, nvm, reactJs, hardhat

## run applications
- Open a terminal tap and run the command of `npm run start` to start the frontend reactJS application

- Open an extral terminal tap to start a local blockchain run `npx hardhat compile` to compile the contract file and generate the ABI code, which will store in the './src/artifacts' of your local file tree

- Run `npx hardhat node` to generate a local node of hardhat and hardhat will generate 20 users with ETHs in the terminal, please mark that down.

- Open another terminal tap and deploy the smart contract to your local hardhat network by running `npx hardhat run scripts/deploy.js --network localhost`, the contract address should appear and please mark that down.

- replace the contract address in `app.js`




