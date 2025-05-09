import React, { useEffect, useState } from 'react';
import { allVisitor } from '../../services/apiService';
import * as XLSX from 'xlsx';

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
  // no more visitor_needs filter, display strictly by check-in order
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

        // Sort by check-in time only (HH:mm format)
        filteredByDate.sort((a, b) => a.visitor_checkin.localeCompare(b.visitor_checkin));

        // Use pure check-in sorted data
        setVisitors(filteredByDate);
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
    // Display all visitors strictly in check-in order
    setFilteredVisitors(visitors);
    setCurrentPage(1);
  }, [visitors]);

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
        return 'bg-blue-50';
      case 'Delivery':
        return 'bg-green-50';
      case 'Contractor':
        return 'bg-red-50';
      case 'Sortir':
        return 'bg-yellow-50';
      default:
        return 'bg-white';
    }
  };

  // Function to format date as dd/mm/yy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Function to export filtered visitors to Excel with custom column widths
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredVisitors);
    const workbook = XLSX.utils.book_new();

    // Define column widths
    const columnWidths = [
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
    ];

    // Apply column widths to the worksheet
    worksheet['!cols'] = columnWidths;

    // Format the file name with the date range
    const formattedStartDate = formatDate(selectedStartDate);
    const formattedEndDate = formatDate(selectedEndDate);
    const fileName = `VisitorLog_${formattedStartDate} - ${formattedEndDate}.xlsx`;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
    XLSX.writeFile(workbook, fileName);
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
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-300 text-base text-gray-700">
            <tr>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">
                NO VISITOR
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                NAMA
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                PERUSAHAAN
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                HOST
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                KEPERLUAN
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                JUMLAH TAMU
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400">
                NOMOR KENDARAAN
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">
                CHECK IN
              </th>
              <th className="py-3 px-4 text-center border-b border-b-gray-400 w-40">
                CHECK OUT
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

      {/* Pagination */}
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