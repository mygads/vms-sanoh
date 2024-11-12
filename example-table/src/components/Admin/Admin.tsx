import React, { useEffect, useState } from 'react';
import { fetchVisitorData } from '../../services/apiService';

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

const Admin: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentVisitors, setCurrentVisitors] = useState<Visitor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchVisitorDataToday = async () => {
      try {
        const visitors = await fetchVisitorData();

        // Get today's date in YYYY-MM-DD format
        const todayDate = new Date().toISOString().split('T')[0];

        // Filter visitors for today who have not checked out yet
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

    // Fetch visitor data
    fetchVisitorDataToday();

    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    // Set current time based on Jakarta timezone
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

    // Update time every second
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(currentVisitors.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Function to map visitor_needs to color classes
  const getVisitorNeedsClass = (needs: string) => {
    switch (needs) {
      case 'Meeting':
        return 'text-blue-600 font-semibold';
      case 'Delivery':
        return 'text-green-600 font-semibold';
      case 'Contractor':
        return 'text-red-600 font-semibold';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 font-sans">
      {/* Cards Row */}
      <div className="flex justify-between w-full space-x-4">
        {/* Visitor Count Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 text-center">
          <h2 className="text-2xl font-semibold">Visitor Active</h2>
          <p className="text-4xl mt-2 text-blue-600 font-bold">
            {visitorCount}
          </p>
        </div>

        {/* Date Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 text-center">
          <h2 className="text-2xl font-semibold">Tanggal hari ini</h2>
          <p className="text-xl mt-2 text-gray-600">{currentDate}</p>
        </div>

        {/* Time Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 text-center">
          <h2 className="text-2xl font-semibold">Waktu</h2>
          <p className="text-4xl mt-2 text-blue-600 font-bold">
            {currentTime}
          </p>
        </div>
      </div>

      {/* Visitor Table */}
      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-300 w-full mt-10">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-base text-gray-700">
            <tr>
              <th className="py-3 px-2 text-center border-b border-gray-400 w-40">
                No Visitor
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400">
                Nama
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400">
                Perusahaan
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400">
                Host
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400">
                Keperluan
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400">
                Jumlah Tamu
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400">
                Nomor Kendaraan
              </th>
              <th className="py-3 px-2 text-center border-b border-gray-400 w-40">
                Check-in
              </th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.length > 0 ? (
              currentVisitors
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((visitor) => (
                  <tr
                    key={visitor.visitor_id}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    <td className="px-2 py-3 text-center text-sm text-gray-600">
                      {visitor.visitor_id}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">
                      {visitor.visitor_name}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-600">
                      {visitor.visitor_from}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-600">
                      {visitor.visitor_host}
                    </td>
                    {/* Updated code starts here */}
                    <td className="px-2 py-3 text-center text-sm">
                      <span className={getVisitorNeedsClass(visitor.visitor_needs)}>
                        {visitor.visitor_needs}
                      </span>
                    </td>
                    {/* Updated code ends here */}
                    <td className="px-2 py-3 text-center text-sm text-gray-600">
                      {visitor.visitor_amount}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-600">
                      {visitor.visitor_vehicle}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-600">
                      {visitor.visitor_checkin}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No visitors available for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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

export default Admin;
