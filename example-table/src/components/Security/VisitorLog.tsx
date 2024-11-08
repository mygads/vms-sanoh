import React, { useEffect, useState } from 'react';
import { allVisitor } from '../../services/apiService';

interface Visitor {
  visitor_id: string;
  visitor_date: string;
  visitor_checkout: string | null;
  visitor_img: string;
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
  const itemsPerPage = 5;

  const getData = async () => {
    try {
      const response = await allVisitor();
      if (Array.isArray(response) && response.length > 0) {
        setVisitors(response);
        setFilteredVisitors(response);
      } else {
        console.warn('No visitor data found');
      }
    } catch (error) {
      console.error('Failed to fetch visitor data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const updatedVisitors =
      filter === 'All'
        ? visitors
        : visitors.filter((visitor) => visitor.visitor_needs === filter);
    setFilteredVisitors(updatedVisitors);
    setCurrentPage(1);
  }, [filter, visitors]);

  // const handlePrint = (visitorId: string) => {
  //   navigate(`/print/${visitorId}`);
  // };

  const handleCheckOut = (visitorId: string) => {
    setVisitors((prev) =>
      prev.map((visitor) =>
        visitor.visitor_id === visitorId
          ? { ...visitor, visitor_checkout: new Date().toLocaleTimeString() }
          : visitor
      )
    );
  };

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const currentVisitors = filteredVisitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Visitor Log</h2>

      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-base text-gray-700">
            <tr>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-20">Foto</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">No Identitas</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">Nama</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">Dari</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">Bertemu</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">Keperluan</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">Jumlah Tamu</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">Nomor Kendaraan</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">Check-in</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">Check-out</th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.length > 0 ? (
              currentVisitors.map((visitor) => (
                <tr
                  key={visitor.visitor_id}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <td className="px-2 py-3 text-center">
                    <img
                      src={`http://127.0.0.1:8000/storage/${visitor.visitor_img}`}
                      alt={`Visitor ${visitor.visitor_name}`}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  </td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_id}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_name}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_from}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_host}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_needs}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_amount}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_vehicle}</td>
                  <td className="px-2 py-3 text-center text-sm">{visitor.visitor_checkin}</td>
                  <td className="px-2 py-3 text-center text-sm">
                    {visitor.visitor_checkout || '-'}
                  </td>
                  <td className="px-2 py-3 text-center text-sm">
                    {!visitor.visitor_checkout && (
                      <div className="flex justify-center space-x-4">
                        {/* <button
                          onClick={() => handlePrint(visitor.visitor_id)}
                          aria-label="Print"
                          className="focus:outline-none"
                        >
                          <img
                            src="/icon_printer.svg"
                            alt="Print"
                            className="w-5 h-5"
                          />
                        </button> */}
                        <button
                          onClick={() => handleCheckOut(visitor.visitor_id)}
                          aria-label="Check-out"
                          className="focus:outline-none"
                        >
                          <img
                            src="/icon_logout.svg"
                            alt="Check-out"
                            className="w-5 h-5"
                          />
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
