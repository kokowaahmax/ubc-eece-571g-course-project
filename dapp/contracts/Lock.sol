// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// contract Lock {
//     uint public unlockTime;
//     address payable public owner;

//     event Withdrawal(uint amount, uint when);

//     constructor(uint _unlockTime) payable {
//         require(
//             block.timestamp < _unlockTime,
//             "Unlock time should be in the future"
//         );

//         unlockTime = _unlockTime;
//         owner = payable(msg.sender);
//     }

//     function withdraw() public {
//         // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
//         // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

//         require(block.timestamp >= unlockTime, "You can't withdraw yet");
//         require(msg.sender == owner, "You aren't the owner");

//         emit Withdrawal(address(this).balance, block.timestamp);

//         owner.transfer(address(this).balance);
//     }
// }

contract StoryBet {

    struct Story {
        address ownerAddress;
        uint numVote;
        string[] tags;
        uint256 publishedDateTime;
        string storyText;
        string[] comments;
    }

    mapping(address => Story) public userStory;
    mapping(address => uint256) public userVoteBalance;

    address owner;
    address[] public users;
    Story[] stories;

    uint public votePrice;

    constructor() {
        owner = msg.sender;
        votePrice = 100000000000000000; // 0.1 ether
    }

    function createStory(string[] memory _tags, uint256 _publishedDateTime, string memory _storyText) public payable {
        require(msg.value >= votePrice, "Not enough token to public a story!");
        string[] memory comments;
        Story memory newStory = Story(msg.sender, 0, _tags, _publishedDateTime, _storyText, comments);
        userStory[msg.sender] = newStory;
        stories.push(newStory);
    }

    function removeStory() public {

    }

    function buyVote(uint256 _buyVoteNum) public payable {
        users.push(msg.sender);
        require(msg.value >= _buyVoteNum * votePrice, "insufficient tokens.");
        userVoteBalance[msg.sender] += _buyVoteNum;
    }

    function refundVote(uint256 _refundVoteNum) public payable {
        require(userVoteBalance[msg.sender] >= _refundVoteNum, "insufficient votes remained in the account");
        userVoteBalance[msg.sender] -= _refundVoteNum;
        payable(msg.sender).transfer(votePrice * _refundVoteNum);
    }

    function vote() public {

    }

    function summaryVotes() public payable {

    }

    function rankStories() public returns (Story[] memory) {

    }

    function clearBoard() public {

    }

    function comment() public {

    }

    function getStories() public view returns (Story[] memory) {
        return stories;
    }

    function getStoryByIndex(uint index) public view returns(Story memory) {
        return stories[index];
    }

    function getUserVote(address addr) public view returns (uint256) {
        return userVoteBalance[addr];
    }

    function getUserStoryVote(address addr) public view returns (uint256) {
        return userStory[addr].numVote;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getAdmin() public view returns (address admin) {
        return owner;
    }
 }