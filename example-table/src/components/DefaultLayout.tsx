import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import logoSanoh from '/logo-sanoh.png';
import ReactSwitch from 'react-switch';

const DefaultLayout: React.FC = () => {
  const [sidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isSecurity = location.pathname.startsWith('/security');
  const isRestricted = location.pathname === '/security/restricted';

  const toggleRestrictedView = () => {
    if (isRestricted) {
      navigate('/security');
    } else {
      navigate('/security/restricted');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar content goes here, if needed */}
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        <header className="bg-white text-white py-2 px-4 mt-3 ml-3 flex justify-between items-center h-16">
          <div className="flex items-center h-full">
            <button onClick={() => navigate(isSecurity ? '/security' : '/admin')}>
              <img src={logoSanoh} alt="Sanoh Logo" className="h-10 w-auto object-contain" />
            </button>
          </div>
          <nav className="space-x-7 flex pr-10">
            <Link to={isSecurity ? "/security/visitor-log" : "/admin/visitor-log"} className="text-gray-900 hover:underline">
              Visitor Log
            </Link>
            {!isSecurity && (
              <Link to="/admin/employees" className="text-gray-900 hover:underline">
                Employee
              </Link>
            )}
            {/* Toggle Switch - Only show on /security path */}
            {isSecurity && (
              <div className="flex justify-end">
                <div className="flex items-center">
                  <ReactSwitch
                    checked={isRestricted}
                    onChange={toggleRestrictedView}
                    onColor="#2563EB"
                    offColor="#D1D5DB"
                  />
                </div>
              </div>
            )}
          </nav>
        </header>

        <main className="p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;