import React from 'react';
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axe from '@axe-core/react';
import App from './App.tsx';
import './index.css';

if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);