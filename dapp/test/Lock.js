const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StoryBet", function() {
  it("1. User have enough money to publish story", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({value: "1000000000000000000"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    await storyBet.createStory(tags, publishedDateTime, storyText);
  });


  it("2. User do not have enough money to publish story", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({value: "100"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    haveError = false;

    try{
      await storyBet.createStory(tags, publishedDateTime, storyText);
      haveError = true;
    }
    catch(err){
    }

    if(haveError == true){
      expect.fail();
    }
  });


  it("3. Multiple users create story", async function() {
    users = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet_1 = await StoryBet.connect(owners[0]).deploy({value: "100000000000000000000"});
    storyBet_2 = await StoryBet.connect(owners[1]).deploy({value: "100"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    

    await storyBet_1.createStory(tags, publishedDateTime, storyText);


    haveError = false;

    try{
      await storyBet_2.createStory(tags, publishedDateTime, storyText);
      haveError = true;
    }
    catch(err){
    }

    if(haveError == true){
      expect.fail();
    }
  });

  it("4. User remove story", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({value: "1000000000000000000"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    await storyBet.createStory(tags, publishedDateTime, storyText);
    
    exist = await storyBet.getUserStoryExist(owners[0].address);
    expect(exist).to.equal(true);
    
    await storyBet.removeStory();

    exist = await storyBet.getUserStoryExist(owners[0].address);
    expect(exist).to.equal(false);
  });

  it("5. User vote himself", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({value: "10000000000000000000"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    haveError = false;
    await storyBet.createStory(tags, publishedDateTime, storyText);

    num_vote = await storyBet.getUserStoryVote(owners[0].address);
    await storyBet.vote(1, owners[0].address);
    new_vote = await storyBet.getUserStoryVote(owners[0].address);
    expect(new_vote).to.equal(num_vote+1)

  });




  it("6. User vote for others test", async function() {
    // owners = await ethers.getSigners();
    // StoryBet = await ethers.getContractFactory("StoryBet");
    // storyBet_1 = await StoryBet.connect(owners[0]).deploy({value: "50000000000000000000"});
    // storyBet_2 = await StoryBet.connect(owners[1]).deploy({value: "50000000000000000000"});

    // const tags = ["tag1", "tag2", "tag3"];
    // const publishedDateTime = 123456789;
    // const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    // await storyBet_1.connect(owners[0]).createStory(tags, publishedDateTime, storyText);
    // await storyBet_2.connect(owners[1]).createStory(tags, publishedDateTime, storyText);
    
    // oldnumvote = await storyBet_1.connect(owners[0]).getUserStoryVote(owners[1].address);

    // await storyBet_1.connect(owners[0]).vote(1, owners[1].address);

    // newnumvote = await storyBet_1.connect(owners[0]).getUserStoryVote(owners[1].address);
    // expect(newnumvote).to.equal(oldnumvote+1);






    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet_1 = await StoryBet.connect(owners[0]).deploy({value: "50000000000000000000"});
    storyBet_2 = await StoryBet.connect(owners[1]).deploy({value: "50000000000000000000"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    await storyBet_1.createStory(tags, publishedDateTime, storyText);
    await storyBet_2.createStory(tags, publishedDateTime, storyText);
    
    oldnumvote = await storyBet_1.getUserStoryVote(owners[1].address);

    await storyBet_1.vote(1, owners[0].address, {value:"200000000000000000",from: owners[1].address});

    newnumvote = await storyBet_1.getUserStoryVote(owners[1].address);
    expect(newnumvote).to.equal(oldnumvote+1);

    
  });

  it("7. User buy vote ", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({value: '10000000000000000000'});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    haveError = false;
    await storyBet.createStory(tags, publishedDateTime, storyText);

    old_balance = await storyBet.getUserVote(owners[0].address);
    await storyBet.buyVote(1);
    new_balance = await storyBet.getUserVote(owners[0].address);
    expect(old_balance).to.equal(ethers.BigNumber.from('10000000000000000000'))

  });














  // it("6. rankStories test", async function() {
  //   owners = await ethers.getSigners();
  //   StoryBet = await ethers.getContractFactory("StoryBet");
  //   storyBet_0 = await StoryBet.connect(owners[0]).deploy({value: "200000000000000000000"});
  //   storyBet_1 = await StoryBet.connect(owners[1]).deploy({value: "200000000000000000000"});
  //   storyBet_2 = await StoryBet.connect(owners[2]).deploy({value: "200000000000000000000"});
  //   storyBet_3 = await StoryBet.connect(owners[3]).deploy({value: "200000000000000000000"});

  //   const tags = ["tag1", "tag2", "tag3"];
  //   const publishedDateTime = 123456789;
  //   const storyText0 = "story0.";
  //   const storyText1 = "story1.";
  //   const storyText2 = "story2.";
  //   const storyText3 = "story3.";
    
  //   await storyBet_0.connect(owners[0]).createStory(tags, publishedDateTime, storyText0);
  //   await storyBet_1.connect(owners[1]).createStory(tags, publishedDateTime, storyText1);
  //   await storyBet_2.connect(owners[2]).createStory(tags, publishedDateTime, storyText2);
  //   await storyBet_3.connect(owners[3]).createStory(tags, publishedDateTime, storyText3);

  //   await storyBet_0.connect(owners[0]).vote(1, owners[1]);
  //   await storyBet_1.vote(1, owners[1]);
  //   await storyBet_2.vote(1, owners[2]);
  //   await storyBet_3.vote(1, owners[1]);
  //  // const vote = storyBet_0.getUserStoryVote(owners[0]);
  // // expect(vote).to.equal(ethers.BigNumber.from("0"))

  // });







  // it("should remove a user's story", async function() {
  //   const tags = ["tag1", "tag2", "tag3"];
  //   const publishedDateTime = 123456789;
  //   const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  //   const votePrice = await storyBet.votePrice();

  //   // User 1 creates a new story
  //   await expect(storyBet.connect(user1).createStory(tags, publishedDateTime, storyText, { value: votePrice }))
  //     .to.emit(storyBet, "StoryCreated")
  //     .withArgs(user1.address);

  //   // User 1 removes their story
  //   await expect(storyBet.connect(user1).removeStory())
  //     .to.emit(storyBet, "StoryRemoved")
  //     .withArgs(user1.address);

  //   // Check that the user's story was removed correctly
  //   const user1Story = await storyBet.userStory(user1.address);
  //   expect(user1Story.exist).to.equal(false);
  // });
});






















// const {time, loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const { expect } = require("chai");

// describe("Lock", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployOneYearLockFixture() {
//     const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//     const ONE_GWEI = 1_000_000_000;

//     const lockedAmount = ONE_GWEI;
//     const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const Lock = await ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//     return { lock, unlockTime, lockedAmount, owner, otherAccount };
//   }

//   describe("Deployment", function () {
//     it("Should set the right unlockTime", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.unlockTime()).to.equal(unlockTime);
//     });

//     it("Should set the right owner", async function () {
//       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       expect(await ethers.provider.getBalance(lock.address)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       const Lock = await ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOneYearLockFixture);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });
