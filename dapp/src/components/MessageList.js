import { Card, Button, Input, List } from "antd";
import React, { useState } from 'react';
import { CrownOutlined, DollarCircleOutlined, CommentOutlined} from '@ant-design/icons';

const { TextArea } = Input;

function MessageList({ messages }) {

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [dollarClicks, setDollarClicks] = useState(0);

  const handleDollarButtonClick = () => {
    setDollarClicks(dollarClicks + 1);
  };

  const handleCommentButtonClick = () => {
    setShowCommentInput(true);
  };

  const handleCommentSubmit = () => {
    // Create a new comment object and add it to the comments array
    const newComment = { text: comment };
    setComments([...comments, newComment]);

    // Reset comment state and hide input field
    setComment('');
    setShowCommentInput(false);
  };

  return (
    <ul style={{ listStyleType: 'none', padding: 0, margin: '15px', flexDirection: 'column', alignItems: 'center' }}>
      {messages.map((message, index) => (
        <li key={message.id} style={{ marginBottom: '10px' }}>
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
            <strong>{message.author}: </strong>
            {message.text}
            </div>
            
            {/* Render the comments as a list */}
            {comments.length > 0 && (
              <List
                dataSource={comments}
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

            {showCommentInput && (
              <div>
                <TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  style={{ borderRadius: '5px', marginTop: '10px' }}
                />
                <Button
                  type="primary"
                  onClick={handleCommentSubmit}
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
                onClick={handleDollarButtonClick}
                style={{
                  borderRadius: '45%',
                  width: '38px',
                  height: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: dollarClicks > 0 ? '#DAA520' : 'inherit'
                }}
              >
                {dollarClicks > 0 && <span style={{ marginLeft: '2px' }}>{dollarClicks}</span>}
              </Button>
              <Button
                shape="circle"
                icon={<CommentOutlined />}
                onClick={handleCommentButtonClick}
              />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
