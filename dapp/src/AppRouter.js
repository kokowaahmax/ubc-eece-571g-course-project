import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const AppRouter = ({ basename = '', children }) => {
  return (
    <BrowserRouter basename={basename}>
      {children}
    </BrowserRouter>
  );
};