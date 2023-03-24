// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract StoryBet {

    struct Story {
        address ownerAddress;
        uint numVote;
        string[] tags;
        uint256 publishedDateTime;
        string storyText;
        string[] comments;
        bool exist;
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
        Story memory newStory = Story(msg.sender, 0, _tags, _publishedDateTime, _storyText, comments, true);
        userStory[msg.sender] = newStory;
        stories.push(newStory);
    }

    function removeStory() public {
        // uint256 l = stories.length;
        // for (uint i = 0; i < l; i++){
        //     if(stories[i].ownerAddress == msg.sender && stories[i].ownerAddress == msg.sender){
        //         stories[i] = stories[l - 1];
        //     }
        // }
        // stories.pop();

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
        userVoteBalance[msg.sender] += _buyVoteNum;
    }

    function refundVote(uint256 _refundVoteNum) public payable {
        require(userVoteBalance[msg.sender] >= _refundVoteNum, "insufficient votes remained in the account");
        userVoteBalance[msg.sender] -= _refundVoteNum;
        payable(msg.sender).transfer(votePrice * _refundVoteNum);
    }

    function vote(uint numVote, address storyOwner) public {
        require(numVote <= userVoteBalance[msg.sender], "ensure adequate account balances");
        userVoteBalance[msg.sender] -= numVote;
        userStory[storyOwner].numVote += numVote;
        uint256 l = stories.length;
        
        for (uint i = 0; i < l; i++){
            if(stories[i].ownerAddress == storyOwner){
                stories[i].numVote += numVote;
            }
        }
        
        rankStories();
    }

    function summaryVotes() public payable {
        require(msg.sender == owner, "only the admin can end vote");
        Story[] memory result = rankStories();
        // the winning dog
        Story memory winningStory = result[0];
        
        address winner = winningStory.ownerAddress;

        payable(winner).transfer((address(this).balance));
        //payable(owner).transfer(address(this).balance);//transfer money back to owner
        
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
        uint len1 = stories.length;
        uint len2 = users.length;
        for(uint i = 0; i < len1; i++){
            stories[i].exist = false;
        }
        
        for(uint i = 0; i < len2; i++){
            userStory[users[i]].exist = false;
        }
    }

    function comment(address storyOwner, string memory storyText) public {
        userStory[storyOwner].comments.push(storyText);
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