import React from 'react';
import { useNavigate } from 'react-router-dom';

const Security: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Security Dashboard</h2>
      <button onClick={() => navigate('/tablet')}>Go to Tablet Dashboard</button>
      <button onClick={() => navigate('/admin')}>Go to Admin Dashboard</button>
      <button onClick={() => navigate('/')}>Logout</button>
    </div>
  );
};

export default Security;
