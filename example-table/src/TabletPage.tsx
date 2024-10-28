import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Visitor Application</h1>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/checkin')}
        >
          Check-in
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-300"
          onClick={() => navigate('/checkout')}
        >
          Check-out
        </button>
      </div>
    </div>
  );
};

export default MainPage;
