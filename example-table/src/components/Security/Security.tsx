import React, { useEffect, useState } from 'react';

const Admin: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentVisitors, setCurrentVisitors] = useState<any[]>([]); // Replace 'any' with a proper type if available
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    const fetchVisitorCount = async () => {
      const count = 42; // Placeholder count
      setVisitorCount(count);
    };

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    fetchVisitorCount();

    // Example visitor data
    setCurrentVisitors([
      { visitor_id: 1, visitor_img: '/path/to/image1.jpg', visitor_name: 'John Doe', visitor_from: 'Company A', visitor_host: 'Jane Smith', visitor_needs: 'Meeting', visitor_amount: 1, visitor_vehicle: 'B1234XYZ', visitor_checkin: '09:00', visitor_checkout: '' },
      // Additional visitor data
    ]);
  }, []);

  const totalPages = Math.ceil(currentVisitors.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePrint = (visitorId: number) => {
    console.log(`Printing for visitor ${visitorId}`);
  };

  const handleCheckOut = (visitorId: number) => {
    console.log(`Checking out visitor ${visitorId}`);
  };

  return (
    <div className="p-6 space-y-6">
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
          <p className="text-xl mt-2 text-gray-700">{currentDate}</p>
        </div>
      </div>

      {/* Visitor Table */}
      <div className="overflow-x-auto w-full max-w-4xl mt-10"> {/* Increased mt to 10 for spacing */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="w-10 h-10 px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Foto</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">No Identitas</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Dari</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Bertemu</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Keperluan</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Jumlah Tamu</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Nomor Kendaraan</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Check-in</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Check-out</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVisitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((visitor) => (
              <tr key={visitor.visitor_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  <img src={visitor.visitor_img} alt="Visitor" className="w-10 h-10 rounded-full mx-auto" />
                </td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_id}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_name}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_from}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_host}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_needs}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_amount}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_vehicle}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_checkin}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_checkout || '-'}</td>
                <td className="px-4 py-2 border-b text-center">
                  <button onClick={() => handlePrint(visitor.visitor_id)} className="mr-2">
                    <img src="/icon_printer.svg" alt="Print" className="w-4 h-4 inline"/>
                  </button>
                  <button onClick={() => handleCheckOut(visitor.visitor_id)}>
                    <img src="/icon_logout.svg" alt="Checkout" className="w-4 h-4 inline"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {currentVisitors.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
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
