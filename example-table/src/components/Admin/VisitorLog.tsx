import React, { useEffect, useState } from 'react';
import { allVisitor } from '../../services/apiService';

interface Visitor {
  visitor_id: string;
  visitor_date: string;
  visitor_checkout: string | null;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  department: string;
  visitor_checkin: string;
}

const VisitorLog: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [filter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [selectedEndDate, setSelectedEndDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const itemsPerPage = 8;

  const getData = async (startDate: string, endDate: string) => {
    try {
      const response = await allVisitor();
      if (Array.isArray(response) && response.length > 0) {
        const filteredByDate = response.filter((visitor) => {
          return (
            visitor.visitor_date >= startDate && visitor.visitor_date <= endDate
          );
        });

        // Sort the filtered visitors by check-in time
        const sortedByCheckin = filteredByDate.sort((a, b) => {
          const timeA = new Date(`${a.visitor_date} ${a.visitor_checkin}`).getTime();
          const timeB = new Date(`${b.visitor_date} ${b.visitor_checkin}`).getTime();
          return timeA - timeB;
        });

        setVisitors(sortedByCheckin);
      } else {
        console.warn('No visitor data found');
        setVisitors([]);
      }
    } catch (error) {
      console.error('Failed to fetch visitor data:', error);
    }
  };

  useEffect(() => {
    getData(selectedStartDate, selectedEndDate);
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const updatedVisitors =
      filter === 'All'
        ? visitors
        : visitors.filter((visitor) => visitor.visitor_needs === filter);
    setFilteredVisitors(updatedVisitors);
    setCurrentPage(1);
  }, [filter, visitors]);

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const currentVisitors = filteredVisitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  // Function to map visitor_needs to row background color classes
  const getRowColorClass = (needs: string) => {
    switch (needs) {
      case 'Meeting':
        return 'bg-blue-100';
      case 'Delivery':
        return 'bg-green-100';
      case 'Contractor':
        return 'bg-red-100';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with date range filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Visitor Log</h2>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.target.value)}
          />
          <span className="mx-2">to</span>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEndDate}
            onChange={(e) => setSelectedEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-base text-gray-700">
            <tr>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">
                No Visitor
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                Nama
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                Perusahaan
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                Host
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                Keperluan
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                Jumlah Tamu
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                Nomor Kendaraan
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">
                Check-in
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">
                Check-out
              </th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.length > 0 ? (
              currentVisitors.map((visitor) => (
                <tr
                  key={visitor.visitor_id}
                  className={`${getRowColorClass(
                    visitor.visitor_needs
                  )} border-b`}
                >
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_id}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_name}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_from}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_host}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_needs}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_amount}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_vehicle}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_checkin}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_checkout || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  No visitors available for this date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredVisitors.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white'
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
                : 'bg-blue-500 text-white'
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

export default VisitorLog;
