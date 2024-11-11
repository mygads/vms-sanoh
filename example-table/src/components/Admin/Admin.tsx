import React, { useEffect, useState } from 'react';
import { fetchVisitorData } from '../../services/apiService';

interface Visitor {
  visitor_id: string;
  // visitor_img: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  visitor_checkin: string;
  visitor_checkout: string | null;
}

const Admin: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentVisitors, setCurrentVisitors] = useState<Visitor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const visitors = await fetchVisitorData();
        setVisitorCount(visitors.length);
        setCurrentVisitors(visitors);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    fetchVisitorCount();
  }, []);

  const totalPages = Math.ceil(currentVisitors.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 space-y-6 font-sans"> {/* Poppins applied via font-sans */}
      {/* Cards Row */}
      <div className="flex justify-between w-full max-w-4xl space-x-2">
        {/* Visitor Count Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 w-1/2 max-w-xs text-center">
          <h2 className="text-2xl font-semibold">Jumlah visitor hari ini</h2>
          <p className="text-4xl mt-2 text-blue-600 font-bold">{visitorCount}</p>
        </div>

        {/* Date Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 w-1/2 max-w-xs text-center">
          <h2 className="text-2xl font-semibold">Tanggal hari ini</h2>
          <p className="text-xl mt-2 text-gray-600">{currentDate}</p>
        </div>
      </div>

      {/* Visitor Table */}
      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-300 w-full max-w-4xl mt-10">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-base text-gray-700">
            <tr>
              {/* <th className="py-3 px-2 text-center border-b border-b-gray-400 w-24">Foto</th> */}
              <th className="py-3 px-2 text-center border-b border-b-gray-400 w-40">No Identitas</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400">Nama</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400">Dari</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400">Bertemu</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400">Keperluan</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400">Jumlah Tamu</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400">Nomor Kendaraan</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400 w-40">Check-in</th>
              <th className="py-3 px-2 text-center border-b border-b-gray-400 w-40">Check-out</th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((visitor) => (
              <tr key={visitor.visitor_id} className="odd:bg-white even:bg-gray-50 border-b">
                {/* <td className="px-2 py-3 text-center">
                  <img
                    src={`http://127.0.0.1:8000/storage/${visitor.visitor_img}`}
                    alt={`Visitor ${visitor.visitor_name}`}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                  />
                </td> */}
                <td className="px-2 py-3 text-center text-sm text-gray-600 font-medium">{visitor.visitor_id}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-700 font-medium">{visitor.visitor_name}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_from}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_host}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_needs}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_amount}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_vehicle}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_checkin}</td>
                <td className="px-2 py-3 text-center text-sm text-gray-600">{visitor.visitor_checkout || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {currentVisitors.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; 
          </button>
          <span className="px-3">{currentPage} of {totalPages}</span>
          <button
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
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
