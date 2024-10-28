import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TabletPage from '../TabletPage';
import CheckInForm from './CheckInForm';
import CheckOutPage from './CheckOutPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TabletPage />} />
        <Route path="/checkin" element={<CheckInForm />} />
        <Route path="/checkout" element={<CheckOutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
