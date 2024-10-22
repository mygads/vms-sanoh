import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <h1>Visitor Application</h1>
      <button className="button" onClick={() => navigate('/checkin')}>
        Check-in
      </button>
      <button className="button" onClick={() => navigate('/checkout')}>
        Check-out
      </button>
    </div>
  );
};

export default MainPage;
