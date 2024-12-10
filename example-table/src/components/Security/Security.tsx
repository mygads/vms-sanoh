import React, { useEffect, useState } from 'react';
import { fetchVisitorData } from '../../services/apiService';
import '@fontsource/poppins';

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

  return (
    <div className="flex flex-col space-y-6 font-satoshi">
      {/* Cards Row */}
      <div className="flex justify-between w-full space-x-6">
        {/* Visitor Active Card */}
        <div className="bg-gradient-to-b from-gray-400 to-white shadow-lg rounded-lg p-8 flex-1 text-center flex items-center justify-center space-x-6">
          <svg
            className="w-9 h-9 text-blue-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth={2}
              d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
            />
          </svg>
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-blue-950">Visitor Aktif</h2>
            <p className="text-4xl mt-2 font-bold text-blue-950">{visitorCount}</p>
          </div>
        </div>

        {/* Date Card */}
        <div className="bg-gradient-to-b from-gray-400 to-white shadow-lg rounded-lg p-8 flex-1 text-center flex items-center justify-center space-x-6">
          <svg
            className="w-9 h-9 text-blue-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>
          <div>
            <h2 className="text-2xl font-semibold text-blue-950">Tanggal hari ini</h2>
            <p className="text-xl mt-2 font-bold text-gray-700">{currentDate}</p>
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-gradient-to-b from-gray-400 to-white shadow-lg rounded-lg p-8 flex-1 text-center flex items-center justify-center space-x-6">
          <svg
            className="w-8 h-8 text-blue-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <div>
            <h2 className="text-2xl font-semibold text-blue-950">Jam</h2>
            <p className="text-4xl mt-2 font-bold text-blue-950">{currentTime}</p>
          </div>
        </div>
      </div>


      {/* Visitor Table */}
      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-200 w-full mt-10">
        <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-950 text-base text-white border-white-900">
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
