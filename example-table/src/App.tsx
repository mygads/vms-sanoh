import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import CheckInForm from './components/CheckInForm';
import CheckOutPage from './components/CheckOutPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/checkin" element={<CheckInForm />} />
        <Route path="/checkout" element={<CheckOutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
