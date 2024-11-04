// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Tablet from './components/Tablet/Tablet';
import CheckInForm from './components/Tablet/CheckInForm';
import CheckOutPage from './components/Tablet/CheckOutPage';
import PrintReceipt from './components/Tablet/PrintReceipt';
import Security from './components/Security/Security';
import Admin from './components/Admin/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tablet" element={<Tablet />} />
        <Route path="/tablet/checkin" element={<CheckInForm />} />
        <Route path="/tablet/checkout" element={<CheckOutPage />} />
        <Route path="/tablet/print/:visitorId" element={<PrintReceipt />} />
        <Route path="/security" element={<Security />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
