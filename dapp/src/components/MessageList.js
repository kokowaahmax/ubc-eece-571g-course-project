import { Card, Button } from "antd";
import React from "react";
import { CrownOutlined, DollarCircleOutlined, CommentOutlined} from '@ant-design/icons';

function MessageList({ messages }) {
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
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '10px' }}>
              <Button shape="circle" icon={<DollarCircleOutlined />} />
              <Button shape="circle" icon={<CommentOutlined />} />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
