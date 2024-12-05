import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchVisitorData } from '../../services/apiService';
import '@fontsource/poppins';
import ReactSwitch from 'react-switch';

// import { FaLock, FaUnlock } from 'react-icons/fa';

interface Visitor {
  visitor_id: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  visitor_checkin: string;
  visitor_checkout: string | null;
  visitor_date: string;
}

const Security: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentVisitors, setCurrentVisitors] = useState<Visitor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // const location = useLocation();

  // Data Fetching useEffect
  useEffect(() => {
    const fetchVisitorDataToday = async () => {
      try {
        const visitors = await fetchVisitorData();
        const todayDate = new Date().toISOString().split('T')[0];
        const todayVisitors = visitors.filter(
          (visitor) =>
            visitor.visitor_date === todayDate && !visitor.visitor_checkout
        );

        setVisitorCount(todayVisitors.length);
        setCurrentVisitors(todayVisitors);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitorDataToday();
    const dataInterval = setInterval(fetchVisitorDataToday, 5000);
    return () => clearInterval(dataInterval);
  }, []);

  // Time Updating useEffect
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    const updateTime = () => {
      const jakartaTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(jakartaTime);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const totalPages = Math.ceil(currentVisitors.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getRowColorClass = (needs: string) => {
    switch (needs) {
      case 'Meeting':
        return 'bg-blue-50';
      case 'Delivery':
        return 'bg-green-50';
      case 'Contractor':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const isRestricted = location.pathname === '/security/restricted';

  const toggleRestrictedView = () => {
    if (isRestricted) {
      navigate('/security');
    } else {
      navigate('/security/restricted');
    }
  };

  return (
    <div className="flex flex-col space-y-6 font-satoshi">
      {/* Toggle Switch */}
      {!isRestricted && (
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

      {/* Cards Row */}
      <div className="flex justify-between w-full space-x-4">
        {/* Visitor Active Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14l4-4m0 0l-4-4m4 4H8" />
          </svg>
          <h2 className="text-2xl font-semibold">Visitor Aktif</h2>
          <p className="text-4xl mt-2 text-blue-800 font-bold">{visitorCount}</p>
        </div>

        {/* Date Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 mx-auto mb-2 text-blue-800">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 3H5c-1.104 0-2 .896-2  2v14c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2V5c0-1.104-.896-2-2-2zM7 3v4M17 3v4" />
          </svg>
          <h2 className="text-2xl font-semibold">Tanggal hari ini</h2>
          <p className="text-xl mt-2 text-gray-600">{currentDate}</p>
        </div>

        {/* Time Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l3 3M16.5 4h-9A2.5 2.5 0 005 6.5v11A2.5 2.5 0 007.5 20h9A2.5 2.5 0 0019 17.5V6.5A2.5 2.5 0 0016.5 4z" />
          </svg>
          <h2 className="text-2xl font-semibold">Jam</h2>
          <p className="text-4xl mt-2 text-blue-800 font-bold">{currentTime}</p>
        </div>
      </div>

      {/* Visitor Table */}
      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-200 w-full mt-10">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-300 text-base text-gray-800 border-gray-200">
            <tr>
              <th className="py-3 px-2 text-center border-b border-gray-400 w-40">NO VISITOR</th>
              <th className="py-3 px-2 text-center border-b border-gray-400">NAMA TAMU</th>
              <th className="py-3 px-2 text-center border-b border-gray-400">PERUSAHAAN</th>
              <th className="py-3 px-2 text-center border-b border-gray-400">HOST</th>
              <th className="py-3 px-2 text-center border-b border-gray-400">KEPERLUAN</th>
              <th className="py-3 px-2 text-center border-b border-gray-400">JUMLAH TAMU</th>
              <th className="py-3 px-2 text-center border-b border-gray-400">NOMOR KENDARAAN</th>
              <th className="py-3 px-2 text-center border-b border-gray-400 w-40">CHECK IN</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {currentVisitors.length > 0 ? (
              currentVisitors
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((visitor) => (
                  <tr key={visitor.visitor_id} className={`${getRowColorClass(visitor.visitor_needs)} border-b`}>
                    <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_id}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_name}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_from}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_host}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_needs}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_amount}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_vehicle}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">{visitor.visitor_checkin}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-3 text-sm text-gray-600">No visitors today.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {currentVisitors.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span className="px-3">
            {currentPage} of {totalPages}
          </span>
          <button
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white'
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Security;