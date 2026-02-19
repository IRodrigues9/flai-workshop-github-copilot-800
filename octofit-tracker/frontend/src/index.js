import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress errors originating from browser extensions (e.g. Fixinator) so
// they don't trigger the React dev-server error overlay.
// Capture phase fires before CRA's bubble-phase handler; stopImmediatePropagation
// prevents any subsequent listener (including the overlay) from seeing the event.
window.addEventListener('error', (event) => {
  const src = event.filename || '';
  const msg = event.message || '';
  if (
    src.startsWith('chrome-extension://') ||
    src.startsWith('moz-extension://') ||
    msg.toLowerCase().includes('fixinator') ||
    msg.toLowerCase().includes('background page')
  ) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }
}, /* capture */ true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
