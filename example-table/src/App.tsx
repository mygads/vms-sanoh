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
import VisitorLog from "./components/Admin/VisitorLog";
import Employees from "./components/Admin/Employees";
import DefaultLayoutAdmin from "./components/DefaultLayoutAdmin";
import DefaultLayoutSecurity from "./components/DefaultLayoutSecurity";
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tablet" element={<Tablet />} />
        <Route path="/tablet/checkin" element={<CheckInForm />} />
        <Route path="/tablet/checkout" element={<CheckOutPage />} />
        <Route path="/tablet/print/:visitorId" element={<PrintReceipt />} />
        <Route element={<DefaultLayoutAdmin />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/visitor-log" element={<VisitorLog />} />
          <Route path="/admin/employees" element={<Employees />} />
        </Route>
        <Route element={<DefaultLayoutSecurity />}>
          <Route path="/security" element={<Security />} />
          <Route path="/security/visitor-log" element={<VisitorLog />} />
          <Route path="/security/employees" element={<Employees />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
