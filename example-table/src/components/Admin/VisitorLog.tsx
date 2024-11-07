import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from './CameraCapture';

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
  const [filter, setFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    company: '',
    purpose: 'Meeting',
    employee: '',
    guestCount: '',
    vehicleNumber: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setShowCamera(true);
    } catch (error) {
      console.error("Camera access denied", error);
      alert("Please allow camera access to capture photos.");
    }
  };

  useEffect(() => {
    try {
      const storedVisitors = localStorage.getItem('visitors');
      if (storedVisitors) {
        setVisitors(JSON.parse(storedVisitors));
        setFilteredVisitors(JSON.parse(storedVisitors));
      }
    } catch (error) {
      console.error("Error loading visitors from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    const updatedVisitors = filter === 'All' ? visitors : visitors.filter((visitor) => visitor.visitor_needs === filter);
    setFilteredVisitors(updatedVisitors);
    setCurrentPage(1);
  }, [filter, visitors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert("Please capture a photo before submitting.");
      return;
    }
    const newVisitor: Visitor = {
      visitor_id: Date.now().toString(),
      visitor_date: formData.date,
      visitor_img: photo,
      visitor_name: formData.name,
      visitor_from: formData.company,
      visitor_host: formData.employee,
      visitor_needs: formData.purpose,
      visitor_amount: parseInt(formData.guestCount) || 0,
      visitor_vehicle: formData.vehicleNumber,
      visitor_checkin: new Date().toLocaleTimeString(),
      visitor_checkout: null,
    };
    setVisitors([...visitors, newVisitor]);
    setShowForm(false);
    setShowCamera(false);
    setFormData({ date: formData.date, name: '', company: '', purpose: 'Meeting', employee: '', guestCount: '', vehicleNumber: '' });
    setPhoto(null);
  };

  const handleCapture = (imageData: string) => {
    setPhoto(imageData);
    setShowCamera(false);
  };

  const handlePrint = (visitorId: string) => {
    navigate(`/print/${visitorId}`);
  };

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
  const currentVisitors = filteredVisitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-2xl font-bold mb-6">Visitor Log</h2>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-900 text-white px-4 py-2 rounded mb-4"
      >
        Check-In
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto ">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-4 md:mx-0 h-full md:h-auto md:overflow-y-auto">
            <h2 className="text-2xl font-bold mt-2 text-center">Visitor Check-In</h2>
            {!showCamera ? (
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Purpose</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Constructor">Constructor</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Employee</label>
                  <input
                    type="text"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Guest Count</label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  {!photo ? (
                    <button
                      type="button"
                      onClick={requestCameraPermission}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Next: Capture Photo
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <CameraCapture onCapture={handleCapture} />
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="w-10 h-10 px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Foto</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">No Identitas</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Nama</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Dari</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Bertemu</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Department</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Keperluan</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Jumlah Tamu</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Nomor Kendaraan</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Check-in</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Check-out</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-center text-sm text-gray-700">Action</th>
            </tr>

          </thead>
          <tbody>
            {currentVisitors.map((visitor) => (
              <tr key={visitor.visitor_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  <img src={visitor.visitor_img} alt="Visitor" className="w-10 h-10 rounded-full mx-auto" />
                </td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_id}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_name}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_from}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.visitor_host}</td>
                <td className="px-4 py-2 border-b text-center">{visitor.department}</td>
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

      {filteredVisitors.length > itemsPerPage && (
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

export default VisitorLog;
