import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ** CSS ** //
// For the purposes of a simple test, I will compile all CSS in one file
import "./css/styles.scss";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);