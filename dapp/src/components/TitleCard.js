import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TitleCard = ({topic}) => {
  return (
    <Card
      style={{
        borderRadius: '15px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#002145',
        marginBottom: '20px',
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: 'center',
          fontFamily: 'cursive',
          fontSize: '30px',
          color: '#ffffff',
          marginBottom: '0',
        }}
      >
        StoryBet
      </Title>
      <Paragraph
        style={{  
          fontFamily: 'sans-serif',
          fontSize: '20px',
          color: '#97D4E9',
          marginTop: '10px',
        }}
      >
        {topic}
      </Paragraph>
    </Card>
  );
};

export default TitleCard;
