import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logoSanoh from '/logo-sanoh.png'; // Adjust the path as needed

const DefaultLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <button onClick={() => navigate('/admin')}>
            <img src={logoSanoh} alt="Sanoh Logo" className="h-10 w-auto object-contain" />
            </button>
          </div>
          <nav className="space-x-7 flex pr-10">
            <Link to="/admin/visitor-log" className="text-gray-900 hover:underline">Visitor Log</Link>
            <Link to="/admin/employees" className="text-gray-900 hover:underline">Employee</Link>
          </nav>
        </header>

        {/* Main content area where the routed pages will be displayed */}
        <main className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
