  import { Card, Button, Input, List } from "antd";
  import React, { useState } from 'react';
  import { ethers } from 'ethers';
  import { CrownOutlined, DollarCircleOutlined, CommentOutlined} from '@ant-design/icons';

  const { TextArea } = Input;

  function StoryList({stories, setStories}) {

    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedStoryId, setSelectedStoryId] = useState(null);

    const handleCommentButtonClick = (storyId) => {
      setSelectedStoryId(storyId);
      setShowCommentInput(true);
    };

    const handleCommentSubmit = (storyId) => {
      // Find the story with the matching ID
      const story = stories.find((s) => s.id === storyId);
    
      // Create a new comment object and add it to the story's comments array
      if (comment) {
        const newComment = { text: comment };
        story.comments.push(newComment);
      }
    
      // Reset comment state and hide input field
      setComment('');
      setShowCommentInput(false);
    };

    const handleDollarButtonClick = (storyId) => {
      // Find the story with the matching ID
      const storyIndex = stories.findIndex((s) => s.id === storyId);
      const story = { ...stories[storyIndex] }; // Create a copy of the story object
    
      // Update the votes for the selected story
      story.votes += 1;
    
      // Create a new array with the updated story object
      const updatedStories = [...stories];
      updatedStories[storyIndex] = story;
      
      const sortedStories = [...updatedStories].sort((a, b) => b.votes - a.votes);
      // Update the state with the new array
      setStories(sortedStories);
    };
  

    return (
      <ul style={{ listStyleType: 'none', padding: 0, margin: '15px', flexDirection: 'column', alignItems: 'center' }}>
        {stories.map((story, index) => (
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
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        style={{ 
                          borderRadius: '15px', 
                          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#00A7E1',
                          width: '100%'
                        }}
                      >
                        <p style={{ margin: 0 }}>{item.text}</p>
                      </Card>
                    </List.Item>
                  )}
                  style={{ marginTop: '10px' }}
                />
              )}

              {showCommentInput && story.id === selectedStoryId && (
                <div>
                  <TextArea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    style={{ borderRadius: '5px', marginTop: '10px' }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleCommentSubmit(story.id)}
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
                  onClick={() => handleDollarButtonClick(story.id)}
                  style={{
                    borderRadius: '45%',
                    width: '38px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: story.votes > 0 ? '#DAA520' : 'inherit'
                  }}
                >
                  {story.votes > 0 && <span style={{ marginLeft: '2px' }}>{story.votes}</span>}
                </Button>
                <Button
                  shape="circle"
                  icon={<CommentOutlined />}
                  onClick={() => handleCommentButtonClick(story.id)}
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  export default StoryList;
