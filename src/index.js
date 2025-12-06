import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Derive basename from PUBLIC_URL (CRA sets this during build) or fallback to '/my-portfolio'
// Ensure we strip trailing slashes so React Router matches consistently.
const computeBaseName = () => {
  const publicUrl = process.env.PUBLIC_URL || '/my-portfolio';
  try {
    const url = new URL(publicUrl, window.location.origin);
    return url.pathname.replace(/\/$/, '') || '/my-portfolio';
  } catch (_) {
    // If PUBLIC_URL isn't a valid URL (e.g., just a path), normalize it.
    return publicUrl.replace(/\/$/, '') || '/my-portfolio';
  }
};

const basename = computeBaseName();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
