import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TabletPage from './components/Tablet';
import MainPage from './components/MainPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tablet" element={<TabletPage />} />
      </Routes>
    </Router>
  );
};

export default App;
