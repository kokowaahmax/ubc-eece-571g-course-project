// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract StoryBet {

    struct Story {
        address ownerAddress;
        uint numVote;
        string[] tags;
        string[] storyTitle;
        uint256 publishedDateTime;
        string storyText;
        string[] comments;
        bool exist;
    }

    mapping(address => Story) public userStory;
    mapping(address => uint256) public userVoteBalance;

    address owner;
    address[] public users;
    Story[] public stories;

    uint public votePrice;

    constructor() payable {
        owner = msg.sender;
        votePrice = 100000000000000000; // 0.1 ether
        // userVoteBalance[msg.sender] = msg.value;
    }

    event StoryAdded(
        address ownerAddress,
        uint numVote,
        string[] tags,
        string[] storyTitle,
        uint256 publishedDateTime,
        string storyText,
        string[] comments,
        bool exist
    );

event StoryAdded2(
        address ownerAddress,
        uint numVote,
        string[] tags,
        string[] storyTitle,
        uint256 publishedDateTime,
        string storyText,
        string[] comments,
        bool exist
    );
    
    function createStory(string[] memory _tags, string[] memory _storyTitle,uint256 _publishedDateTime, string memory _storyText) public payable {

        // Check if the sender has enough ether
        require(userVoteBalance[msg.sender] >= votePrice, "Not enough token to public a story!");
        
        // Update the vote balances
        userVoteBalance[msg.sender] -= votePrice;
        userVoteBalance[address(this)] += votePrice;
        
        // Create the new story
        string[] memory comments;
        Story memory newStory = Story(msg.sender, 0, _tags, _storyTitle,_publishedDateTime, _storyText, comments, true);
        userStory[msg.sender] = newStory;
        stories.push(newStory);
        users.push(msg.sender);

        emit StoryAdded(msg.sender, 0, _tags, _storyTitle, _publishedDateTime, _storyText, comments, true);
    }

    function removeStory() public {
        userStory[msg.sender].exist = false;
        
        uint256 l = stories.length;
        for (uint i = 0; i < l; i++){
            if(stories[i].ownerAddress == msg.sender){
                stories[i].exist = false;
            }
        }
    }

    function buyVote(uint256 _buyVoteNum) public payable {
        users.push(msg.sender);
        require(msg.value >= _buyVoteNum * votePrice, "insufficient tokens.");
        userVoteBalance[msg.sender] += _buyVoteNum * votePrice;
    }

    function refundVote(uint256 _refundVoteNum) public payable {
        require(userVoteBalance[msg.sender] >= _refundVoteNum * votePrice, "insufficient votes remained in the account");
        userVoteBalance[msg.sender] -= _refundVoteNum * votePrice;
        payable(msg.sender).transfer(votePrice * _refundVoteNum);
    }

    function vote(uint numVote, address storyOwner, uint256 publishedDateTime) public payable{
        require(userStory[storyOwner].exist == true, "User must have story to be voted");
        require(numVote <= userVoteBalance[msg.sender], "ensure adequate account balances");
        console.log("into vote methods, the number is %s", numVote);
        userVoteBalance[msg.sender] -= numVote * votePrice;
        userVoteBalance[address(this)] += numVote * votePrice;

        if (userStory[storyOwner].publishedDateTime == publishedDateTime) {
            userStory[storyOwner].numVote += numVote;
            emit StoryAdded2(storyOwner, userStory[storyOwner].numVote, userStory[storyOwner].tags, userStory[storyOwner].storyTitle, userStory[storyOwner].publishedDateTime, userStory[storyOwner].storyText, userStory[storyOwner].comments, true);

            uint256 l = stories.length;
            for (uint i = 0; i < l; i++){
                if( stories[i].publishedDateTime == publishedDateTime ){
                    stories[i].numVote += numVote;
                }
            }
        } else {
            uint256 l = stories.length;
            for (uint i = 0; i < l; i++){
                if( stories[i].publishedDateTime == publishedDateTime ){
                    stories[i].numVote += numVote;
                    emit StoryAdded2(storyOwner, stories[i].numVote, stories[i].tags, stories[i].storyTitle, stories[i].publishedDateTime, stories[i].storyText, stories[i].comments, true);
                }
            }
        }
    }

    function summaryVotes() public payable {
        require(msg.sender == owner, "only the admin can end vote");
        uint allVotes = 0;

        for (uint i = 0; i < stories.length; i++) {
            if (stories[i].exist) {
                allVotes += stories[i].numVote;
            }
        }

        uint highestVote = 0;
        address winner = address(0);

        for (uint i = 0; i < users.length; i++) {
            uint temp = 0;
            for (uint j = 0; j < stories.length; j++) {
                if (stories[j].exist && stories[j].ownerAddress == users[i]) {
                    temp += stories[j].numVote;
                }
            }
            if (temp > highestVote) {
                highestVote = temp;
                winner = users[i];
            }
        }

        userVoteBalance[winner] += allVotes * votePrice;

        clearBoard();
    }

    function rankStories() public returns (Story[] memory) {
        Story[] memory newstory;
        uint j = 0;
        for(uint i ; i < stories.length; i++){
            if(stories[i].exist == true){
                newstory[j++] = stories[i];
            }
        }
        sort(newstory);
        return newstory;
    }

    function sort(Story[] memory data) public returns (Story[] memory) {
        quickSort(data, int(0), int(data.length - 1));
        return data;
    }

    function quickSort(Story[] memory arr, int left, int right) public{
        int i = left;
        int j = right;
        if (i == j) return;
        uint pivot = arr[uint(left + (right - left) / 2)].numVote;
        while (i <= j) {
            while (arr[uint(i)].numVote < pivot) i++;
            while (pivot < arr[uint(j)].numVote) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    function clearBoard() public {
        require(msg.sender == owner, "Only the admin can end vote");
        uint len1 = stories.length;
        for(uint i = 0; i < len1; i++){
            stories[i].exist = false;
        }
    }

    function comment(address storyOwner, string memory storyText, uint256 publishedDateTime) public {
        userStory[storyOwner].comments.push(storyText);
        for (uint i = 0; i < stories.length; i++) {
            if (stories[i].publishedDateTime == publishedDateTime) {
                stories[i].comments.push(storyText);
            }
        }
    }

    function getStories() public view returns (Story[] memory) {
        // return stories;
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

    function getUserStoryExist(address addr) public view returns (bool) {
        return userStory[addr].exist;
    }

    function getUserComment(address addr) public view returns (string[] memory) {
        return userStory[addr].comments;
    }
    function getUserStoryTitle(address addr) public view returns (string[] memory) {
        return userStory[addr].storyTitle;
    }
    function getStoryAuthor(address addr) public view returns (string[] memory) {
        return userStory[addr].tags;
    }
    
    function getAllUserStories(address addr) public view returns (Story[] memory) {
        uint storiesNum = 0;

        for (uint i = 0; i < stories.length; i++) {
            if (stories[i].ownerAddress == addr) { storiesNum++; }
        }

        uint temp = 0;
        Story[] memory returnValue = new Story[](storiesNum);

        for (uint i = 0; i < stories.length; i++) {
            if (stories[i].ownerAddress == addr) {
                returnValue[temp] = stories[i];
                temp++;
            } 
        }

        return returnValue;
    }

}