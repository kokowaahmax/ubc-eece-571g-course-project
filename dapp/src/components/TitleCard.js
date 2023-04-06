import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TitleCard = () => {
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
          color: '#888',
          marginTop: '10px',
        }}
      >
        Welcome to StoryBet! Are you ready to put your creativity to the test? We challenge you to write a short story with at most 100 characters, starting with "I love to eat carbonara so much". The twist? The story should be unexpected and unique. The story with the most votes at the end of the competition will win all tokens in the pool. So what are you waiting for? Let's start writing!
      </Paragraph>
    </Card>
  );
};

export default TitleCard;
