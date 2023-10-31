import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

import StartRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StartRating maxLength = {10}/>
    
  </React.StrictMode>
);

