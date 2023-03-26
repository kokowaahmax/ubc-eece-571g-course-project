const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StoryBet", function () {
  it("1. User have enough money to publish story", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({ value: "1000000000000000000" });

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    await storyBet.createStory(tags, publishedDateTime, storyText);
  });


  it("2. User do not have enough money to publish story", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({ value: "100" });

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    haveError = false;

    try {
      await storyBet.createStory(tags, publishedDateTime, storyText);
      haveError = true;
    }
    catch (err) {
    }

    if (haveError == true) {
      expect.fail();
    }
  });


  it("3. Multiple users create story", async function () {
    users = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet_1 = await StoryBet.connect(owners[0]).deploy({ value: "100000000000000000000" });
    storyBet_2 = await StoryBet.connect(owners[1]).deploy({ value: "100" });

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";


    await storyBet_1.createStory(tags, publishedDateTime, storyText);


    haveError = false;

    try {
      await storyBet_2.createStory(tags, publishedDateTime, storyText);
      haveError = true;
    }
    catch (err) {
    }

    if (haveError == true) {
      expect.fail();
    }
  });

  it("4. User remove story", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({ value: "1000000000000000000" });

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

  it("5. User vote himself", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({ value: "10000000000000000000" });

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    haveError = false;
    await storyBet.createStory(tags, publishedDateTime, storyText);

    num_vote = await storyBet.getUserStoryVote(owners[0].address);
    await storyBet.vote(1, owners[0].address);
    new_vote = await storyBet.getUserStoryVote(owners[0].address);
    expect(new_vote).to.equal(num_vote + 1)

  });


  it("6. User vote for others", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({ value: "50000000000000000000" });
    await storyBet.connect(owners[1]).buyVote(500, { value: "50000000000000000000" });

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    await storyBet.connect(owners[1]).createStory(tags, publishedDateTime, storyText,);

    oldnumvote = await storyBet.getUserStoryVote(owners[1].address);
    old_user_balance = await storyBet.getUserVote(owners[0].address);
    old_manager_balance = await storyBet.getUserVote(storyBet.address);

    expect(old_manager_balance).to.equal(ethers.BigNumber.from("100000000000000000"));
    expect(old_user_balance).to.equal(ethers.BigNumber.from("50000000000000000000"));

    await storyBet.vote(300, owners[1].address);

    newnumvote = await storyBet.getUserStoryVote(owners[1].address);
    new_user_balance = await storyBet.getUserVote(owners[1].address);
    new_manager_balance = await storyBet.getUserVote(storyBet.address);


    expect(newnumvote).to.equal(oldnumvote + 300);
    expect(new_user_balance).to.equal(ethers.BigNumber.from("49900000000000000000"));
    expect(new_manager_balance).to.equal(ethers.BigNumber.from("30100000000000000000"));
  });


  it("7. Multiple users vote test", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();

    for (let i = 1; i < 4; i++) {
      await storyBet.connect(owners[i]).buyVote(2, { value: "300000000000000000" });
      //Buy 2 vote 
      //expect(await storyBet_0.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    }

    //Buy 2 vote 
    for (let i = 1; i < 4; i++) {
      expect(await storyBet.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    }

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;

    const storyText1 = "story1";
    const storyText2 = "story2";
    const storyText3 = "story3";

    await storyBet.connect(owners[1]).createStory(tags, publishedDateTime, storyText1);
    await storyBet.connect(owners[2]).createStory(tags, publishedDateTime, storyText2);
    await storyBet.connect(owners[3]).createStory(tags, publishedDateTime, storyText3);

    for (let i = 1; i < 4; i++) {
      expect(await storyBet.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("100000000000000000"));
    }

    await storyBet.connect(owners[1]).vote(1, owners[1].address);
    await storyBet.connect(owners[2]).vote(1, owners[1].address);
    await storyBet.connect(owners[3]).vote(1, owners[2].address);

    vote = await storyBet.getUserStoryVote(owners[1].address);
    expect(vote).to.equal(ethers.BigNumber.from("2"))
    vote = await storyBet.getUserStoryVote(owners[2].address);
    expect(vote).to.equal(ethers.BigNumber.from("1"))
    vote = await storyBet.getUserStoryVote(owners[3].address);
    expect(vote).to.equal(ethers.BigNumber.from("0"))
  });


  it("8. User can refund votes", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();

    await storyBet.connect(owners[0]).buyVote(60, { value: "50000000000000000000" });
    voteBalance = await storyBet.getUserVote(owners[0].address);


    expect(voteBalance).to.equal(ethers.BigNumber.from("6000000000000000000"));

    await storyBet.connect(owners[0]).refundVote(45);
    voteBalance = await storyBet.getUserVote(owners[0].address);
    expect(voteBalance).to.equal(ethers.BigNumber.from("1500000000000000000"));
  });

  it("9. Clear Board", async function () {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();

    for (let i = 1; i < 4; i++) {
      await storyBet.connect(owners[i]).buyVote(2, { value: "300000000000000000" });
      //Buy 2 vote 
      //expect(await storyBet_0.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    }

    //Buy 2 vote 
    for (let i = 1; i < 4; i++) {
      expect(await storyBet.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    }

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;

    const storyText1 = "story1";
    const storyText2 = "story2";
    const storyText3 = "story3";

    await storyBet.connect(owners[1]).createStory(tags, publishedDateTime, storyText1);
    await storyBet.connect(owners[2]).createStory(tags, publishedDateTime, storyText2);
    await storyBet.connect(owners[3]).createStory(tags, publishedDateTime, storyText3);

    for (let i = 1; i < 4; i++) {
      expect(await storyBet.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("100000000000000000"));
    }

    await storyBet.connect(owners[1]).vote(1, owners[1].address);
    await storyBet.connect(owners[2]).vote(1, owners[1].address);
    await storyBet.connect(owners[3]).vote(1, owners[2].address);

    vote = await storyBet.getUserStoryVote(owners[1].address);
    expect(vote).to.equal(ethers.BigNumber.from("2"))
    vote = await storyBet.getUserStoryVote(owners[2].address);
    expect(vote).to.equal(ethers.BigNumber.from("1"))
    vote = await storyBet.getUserStoryVote(owners[3].address);
    expect(vote).to.equal(ethers.BigNumber.from("0"))
  

    await storyBet.connect(owners[0]).clearBoard();

    exist = await storyBet.getUserStoryExist(owners[0].address);
    expect(exist).to.equal(false);
    exist = await storyBet.getUserStoryExist(owners[1].address);
    expect(exist).to.equal(false);
    exist = await storyBet.getUserStoryExist(owners[2].address);
    expect(exist).to.equal(false);
    exist = await storyBet.getUserStoryExist(owners[3].address);
    expect(exist).to.equal(false);
  });

  it("10. User can comment", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();

    for(let i = 1; i < 4; i++){
      await storyBet.connect(owners[i]).buyVote(2, {value: "300000000000000000"});
    }

    //Buy 2 vote 
    for(let i = 1; i < 4; i++){
      expect(await storyBet.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    }

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789; 

    const storyText1 = "story1";
    const storyText2 = "story2";
    const storyText3 = "story3";

    const storycomment1 = 'good story'
    const storycomment2 = 'bad story'
    const storycomment3 = 'not good or bad story'

    await storyBet.connect(owners[1]).createStory(tags, publishedDateTime, storyText1);
    await storyBet.connect(owners[2]).createStory(tags, publishedDateTime, storyText2);
    await storyBet.connect(owners[3]).createStory(tags, publishedDateTime, storyText3);

    for(let i = 1; i < 4 ; i++){
      expect(await storyBet.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("100000000000000000"));
    }

    await storyBet.connect(owners[1]).comment( owners[1].address, storycomment1);
    await storyBet.connect(owners[1]).comment( owners[2].address, storycomment2); 

    comment = await storyBet.getUserComment(owners[1].address);
    expect(comment[0]).to.equal(storycomment1)
    comment = await storyBet.getUserComment(owners[2].address);
    expect(comment[0]).to.equal(storycomment2)
  });

  it("11. SummaryVote", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();

    await storyBet.connect(owners[1]).buyVote(5, {value: "900000000000000000"});
    await storyBet.connect(owners[2]).buyVote(5, {value: "900000000000000000"});

    const tags1 = ["fantasy", "adventure"];
    const publishedDateTime1 = Math.floor(Date.now() / 1000);
    const storyText1 = "This is the first story.";
    await storyBet.connect(owners[1]).createStory(tags1, publishedDateTime1, storyText1);

    const tags2 = ["science fiction", "thriller"];
    const publishedDateTime2 = Math.floor(Date.now() / 1000) + 3600; // 1 hour later
    const storyText2 = "This is the second story.";
    await storyBet.connect(owners[2]).createStory(tags2, publishedDateTime2, storyText2);

    await storyBet.connect(owners[1]).vote(2, owners[2].address);
    await storyBet.connect(owners[2]).vote(1, owners[1].address);


    // End the vote and transfer winnings to the winning story's owner
    await storyBet.connect(owners[0]).summaryVotes();

    winnerBalance = await storyBet.connect(owners[2]).getUserVote(owners[2].address);
    expect(winnerBalance).to.equal(ethers.BigNumber.from("600000000000000000"));

    // 5 -1 -1 + 3 = 6
  });
});
