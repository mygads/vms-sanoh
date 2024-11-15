import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import logoSanoh from '/logo-sanoh.png'; // Adjust the path as needed

const DefaultLayout: React.FC = () => {
  const [sidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.getItem('role');
  }, []);

  const isSecurity = location.pathname.startsWith('/security');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (optional, only if needed) */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar content goes here, if needed */}
      </div>

      {/* Content Area */}
      <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        {/* Header with clickable Sanoh logo */}
        <header className="bg-gray-300 text-white py-2 px-4 flex justify-between items-center h-16">
          <div className="flex items-center h-full">
            <button onClick={() => navigate(isSecurity ? '/security' : '/admin')}>
              <img src={logoSanoh} alt="Sanoh Logo" className="h-10 w-auto object-contain" />
            </button>
          </div>
          <nav className="space-x-7 flex pr-10">
            <Link to={isSecurity ? "/security/visitor-log" : "/admin/visitor-log"} className="text-gray-900 hover:underline">Visitor Log</Link>
            {!isSecurity && (
              <Link to="/admin/employees" className="text-gray-900 hover:underline">Employee</Link>
            )}
          </nav>
        </header>

        {/* Main content area where the routed pages will be displayed */}
        <main className="p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
