// Tablet.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Tablet: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo Image */}
      <img src="/logo-sanoh.png" alt="Logo" className="w-48 h-auto mb-8" />
      <div className="flex flex-col items-center space-y-6">
        <Link to="/tablet/checkin">
          <button className="w-64 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
            Check-In
          </button>
        </Link>
        <Link to="/tablet/checkout">
          <button className="w-64 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none">
            Check-Out
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Tablet;
