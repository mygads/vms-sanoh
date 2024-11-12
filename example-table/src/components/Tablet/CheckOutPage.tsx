import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVisitorData, checkOutVisitor, Visitor } from '../../services/apiService';

const CheckOutPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [showFilterButton, setShowFilterButton] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const data = await fetchVisitorData();
      const today = new Date().toISOString().split('T')[0];
      const todayVisitors = data.filter(
        (visitor) => visitor.visitor_date === today && !visitor.visitor_checkout
      );

      setVisitors(todayVisitors);
      setFilteredVisitors(todayVisitors);
      setShowFilterButton(todayVisitors.length >= 10);
    } catch (error) {
      console.error('Failed to fetch visitor data:', error);
    }
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
      navigate('/tablet/'); // Redirect to main page after check-out
    } catch (error) {
      console.error('Failed to check out visitor:', error);
    }
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

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisitors = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
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

      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-base text-gray-700">
            <tr>
              {/* <th className="py-3 text-center border-b border-b-gray-400 w-24">Foto</th> */}
              <th className="py-3 text-center border-b border-b-gray-400 w-40">No Visitor</th>
              <th className="py-3 text-center border-b border-b-gray-400">Nama</th>
              <th className="py-3 text-center border-b border-b-gray-400">Perusahaan</th>
              <th className="py-3 text-center border-b border-b-gray-400">Keperluan</th>
              <th className="py-3 text-center border-b border-b-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.length > 0 ? (
              currentVisitors.map((visitor) => (
                <tr key={visitor.visitor_id} className="odd:bg-white even:bg-gray-50 border-b">
                  {/* <td className="px-2 py-3 text-center">
                    <img
                      src={`http://127.0.0.1:8000/storage/${visitor.visitor_img}`}
                      alt={`Visitor ${visitor.visitor_name}`}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  </td> */}
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_id}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_name}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_from}</td>
                  {/* Updated code starts here */}
                  <td className="px-2 py-3 text-center text-sm">
                    <span className={getVisitorNeedsClass(visitor.visitor_needs)}>
                      {visitor.visitor_needs}
                    </span>
                  </td>
                  {/* Updated code ends here */}
                  <td className="px-2 py-3 text-center text-sm">
                    {!visitor.visitor_checkout && (
                      <div className="flex justify-center space-x-4">
                        {/* <button onClick={() => handlePrint(visitor.visitor_id)} aria-label="Print" className="focus:outline-none">
                          <img src="/icon_printer.svg" alt="Print" className="w-5 h-5" />
                        </button> */}
                        <button onClick={() => handleCheckOut(visitor.visitor_id)} aria-label="Check-out" className="focus:outline-none">
                          <img src="/icon_logout.svg" alt="Check-out" className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  No visitors available for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredVisitors.length > itemsPerPage && (
        <div className="flex justify-end mt-6 items-center space-x-2">
          <button
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          <span className="px-4 py-2 bg-blue-500 text-white rounded-md">{currentPage}</span>

          <button
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${
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
