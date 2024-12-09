import React from 'react';
import { Link } from 'react-router-dom';

const Tablet: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo Image */}
      <img src="/logo-sanoh.png" alt="Logo" className="w-48 h-auto mb-7" />
      
      {/* Welcome Text */}

      <div className="flex flex-col items-center space-y-6">
        <Link to="/tablet/checkin">
          <button className="flex items-center justify-center w-64 px-6 py-3 bg-purple-700 text-white rounded-md hover:bg-purple-600 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Check-In
          </button>
        </Link>
        <Link to="/tablet/checkout">
          <button className="flex items-center justify-center w-64 px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-500 focus:outline-none">
            Check-Out
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Tablet;