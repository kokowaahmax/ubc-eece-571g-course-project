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


  it("6. User vote for others", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy({value: "50000000000000000000"});
    await storyBet.connect(owners[1]).buyVote(500, {value: "50000000000000000000"});

    const tags = ["tag1", "tag2", "tag3"];
    const publishedDateTime = 123456789;
    const storyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    await storyBet.connect(owners[1]).createStory(tags, publishedDateTime, storyText, );
    
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


  it("7. Multiple users vote test", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();
    
    for(let i = 1; i < 4; i++){
      await storyBet.connect(owners[i]).buyVote(2, {value: "300000000000000000"});
      //Buy 2 vote 
      //expect(await storyBet_0.getUserVote(owners[i].address)).to.equal(ethers.BigNumber.from("200000000000000000"));
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
    
    await storyBet.connect(owners[1]).createStory(tags, publishedDateTime, storyText1);
    await storyBet.connect(owners[2]).createStory(tags, publishedDateTime, storyText2);
    await storyBet.connect(owners[3]).createStory(tags, publishedDateTime, storyText3);
    
    for(let i = 1; i < 4 ; i++){
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


  it("8. User have enough money to buy vote", async function() {
    owners = await ethers.getSigners();
    StoryBet = await ethers.getContractFactory("StoryBet");
    storyBet = await StoryBet.connect(owners[0]).deploy();

    await storyBet.connect(owners[0]).buyVote(60, {value: "50000000000000000000"});
    voteBalance = await storyBet.getUserVote(owners[0].address);
    

    expect(voteBalance).to.equal(ethers.BigNumber.from("6000000000000000000"));

    await storyBet.connect(owners[0]).refundVote(45);
    voteBalance = await storyBet.getUserVote(owners[0].address);
    expect(voteBalance).to.equal(ethers.BigNumber.from("1500000000000000000"));

  });
});
