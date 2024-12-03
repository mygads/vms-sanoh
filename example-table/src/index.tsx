// index.tsx
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import React from 'react'; // Import React
import App from './App'; // Import the App component
import './index.css';
// import '@fontsource/poppins';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
