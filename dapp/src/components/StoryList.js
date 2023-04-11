  import { Card, Button, Input, List, message } from "antd";
  import React, { useState } from 'react';
  import { ethers } from 'ethers';
  import { CrownOutlined, DollarCircleOutlined, CommentOutlined} from '@ant-design/icons';

  const { TextArea } = Input;

  function StoryList({stories, setStories, storyBet}) {

    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedStoryId, setSelectedStoryId] = useState(null);

    const handleCommentButtonClick = (storyId) => {
      setSelectedStoryId(storyId);
      setShowCommentInput(true);
    };

    const handleCommentSubmit = async(storyId) => {
      // Find the story with the matching ID
      const newStoryIndex = stories.findIndex((s) => s.publishedDateTime === storyId);
    
      // Create a new comment object and add it to the story's comments array
      if (comment) {
        const newComment = comment;
        const updatedComments = [...stories[newStoryIndex].comments, newComment];
        const updatedStory = { ...stories[newStoryIndex], comments: updatedComments };

        const updatedStories = stories.map((s) => {
          if (s.publishedDateTime === updatedStory.publishedDateTime) {
            return updatedStory;
          }
          return s;
        });
        await storyBet.comment(updatedStory.ownerAddress, comment, updatedStory.publishedDateTime);
        setStories(updatedStories);
      }
    
      // Reset comment state and hide input field
      setComment('');
      setShowCommentInput(false);
    };
  
    //storyid = date
    const handleVoteButtonClick = async(storyId) => {
      const storyIndex = stories.findIndex((s) => s.publishedDateTime === storyId);
      const story = { ...stories[storyIndex] }; // Create a copy of the story object
      // story.numVote = parseInt(story.numVote.toString(), 10);
      try {
        await storyBet.vote(1, story.ownerAddress, story.publishedDateTime);
        message.success("Your vote is submitted!")
      } catch (error) {
        message.error("Can't vote! Do you have enough coins?")
      }
    };

    return (
      <ul style={{ listStyleType: 'none', padding: 0, margin: '15px', flexDirection: 'column', alignItems: 'center' }}>
        {stories.filter(story => story.exist).map((story, index) => (
          <li key={parseInt(ethers.utils.formatUnits(story.publishedDateTime, 0))} style={{ marginBottom: '10px' }}>
            <Card style={{ 
                borderRadius: '15px', 
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#97D4E9' }}>
              {index === 0 && (
                <div style={{ position: 'absolute', top: '0', right: '0' }}>
                  <CrownOutlined style={{ 
                    color: 'goldenrod', 
                    fontSize: '30px', 
                    position: 'absolute', 
                    top: '-10px', 
                    right: '-10px', 
                    transform: 'rotate(15deg)' }}  />
                </div>
              )}
              <div>
              <strong>{story.tags[0]}: </strong>
              {story.storyText}
              </div>
              
              {/* Render the comments as a list */}
              {story.comments && story.comments.length > 0 && (
                <List
                  dataSource={story.comments}
                  renderItem={(comment) => (
                    <List.Item>
                      <Card
                        style={{ 
                          borderRadius: '15px', 
                          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#00A7E1',
                          width: '100%'
                        }}
                      >
                        <p style={{ margin: 0 }}>{comment}</p>
                      </Card>
                    </List.Item>
                  )}
                  style={{ marginTop: '10px' }}
                />
              )}

              {showCommentInput && story.publishedDateTime === selectedStoryId && (
                <div>
                  <TextArea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    style={{ borderRadius: '5px', marginTop: '10px' }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleCommentSubmit(story.publishedDateTime)}
                    style={{ marginTop: '10px' }}
                  >
                    Submit
                  </Button>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '10px' }}>
               <Button
                  shape="circle"
                  icon={<DollarCircleOutlined />}
                  onClick={() => handleVoteButtonClick(story.publishedDateTime)}
                  style={{
                    borderRadius: '45%',
                    width: '38px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                    color: parseInt(story.numVote.toString(), 10) > 0 ? '#DAA520' : 'inherit'
                  }}
                >
                  {parseInt(story.numVote.toString(), 10) > 0 && <span style={{ marginLeft: '2px' }}>{parseInt(story.numVote.toString(), 10)}</span>}
                </Button>
                <Button
                  shape="circle"
                  icon={<CommentOutlined />}
                  onClick={() => handleCommentButtonClick(story.publishedDateTime)}
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  export default StoryList;
