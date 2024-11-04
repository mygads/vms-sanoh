// Admin.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/tablet')}>Go to Tablet Dashboard</button>
      <button onClick={() => navigate('/security')}>Go to Security Dashboard</button>
      <button onClick={() => navigate('/')}>Logout</button>
    </div>
  );
};

export default Admin;
