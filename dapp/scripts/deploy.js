async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const StoryBet = await ethers.getContractFactory("StoryBet");
  const storyBet = await StoryBet.deploy();

  console.log(`StoryBet address: ${storyBet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });