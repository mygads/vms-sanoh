import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVisitorData, checkOutVisitor, Visitor } from '../services/apiService';

const CheckOutPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [showFilterButton, setShowFilterButton] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const getData = async () => {
    const data = await fetchVisitorData();
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = data.filter(
      (visitor) => visitor.visitor_date === today && !visitor.visitor_checkout
    );

    setVisitors(todayVisitors);
    setFilteredVisitors(todayVisitors);
    setShowFilterButton(todayVisitors.length >= 10);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredVisitors(visitors);
    } else {
      setFilteredVisitors(visitors.filter((visitor) => visitor.visitor_needs === filter));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filter, visitors]);

  const handleCheckOut = async (visitorId: string) => {
    try {
      await checkOutVisitor(visitorId);
      await getData(); // Refresh data after successful check-out
      navigate('/'); // Redirect to main page after check-out
    } catch (error) {
      console.error('Failed to check out visitor:', error);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  // Ensure currentPage is within valid bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisitors = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    // Clamp pageNumber between 1 and totalPages
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Visitor Check-out</h2>
      
      {showFilterButton && (
        <div className="mb-6">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Meeting">Meeting</option>
            <option value="Delivery">Delivery</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="w-40 px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Foto</th>
              <th className="w-40 px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">No Identitas</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Nama</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Dari</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Bertemu</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Keperluan</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Jumlah Tamu</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Nomor Kendaraan</th>
              <th className="w-60 px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Check-in</th>
              <th className="w-60 px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Check-out</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.map((visitor) => (
              <tr key={visitor.visitor_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-center">
                  <img
                    src={`http://127.0.0.1:8000/storage/${visitor.visitor_img}`}
                    alt={`Visitor ${visitor.visitor_name}`}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_id}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_name}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_from}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_host}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_needs}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_amount}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_vehicle}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_checkin}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">{visitor.visitor_checkout || '-'}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm text-gray-700">
                  {!visitor.visitor_checkout && (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                      onClick={() => handleCheckOut(visitor.visitor_id)}
                    >
                      Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredVisitors.length >= itemsPerPage && (
        <div className="flex justify-end mt-6 items-center space-x-2">
          <button
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          <span className="px-4 py-2 bg-blue-500 text-white rounded-md">
            {currentPage}
          </span>
          
          <button
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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

export default CheckOutPage;
