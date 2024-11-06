import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from './CameraCapture';
import { submitVisitorData, fetchEmployeeData, Employee } from '../../services/apiService';

interface VisitorData {
  visitor_date: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  department?: string;
  visitor_img?: string;
}

const CheckInForm: React.FC = () => {
  const [formData, setFormData] = useState<VisitorData>({
    visitor_date: '',
    visitor_name: '',
    visitor_from: '',
    visitor_host: '',
    visitor_needs: '',
    visitor_amount: 1,
    visitor_vehicle: '',
    department: '',
  });
  const [showCamera, setShowCamera] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suggestions, setSuggestions] = useState<Employee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees from backend using your apiService function
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await fetchEmployeeData();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVisitorHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, visitor_host: value, department: '' });

    if (value.length > 0 && employees.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      const filteredSuggestions = employees.filter((employee) =>
        regex.test(employee.name)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Employee) => {
    setFormData({
      ...formData,
      visitor_host: suggestion.name,
      department: suggestion.department,
    });
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCamera(true);
  };

  const handleImageCapture = async (imageData: string) => {
    const visitorData = { ...formData, visitor_img: imageData };

    try {
      await submitVisitorData(visitorData);
      console.log('Data submitted successfully');

      // Redirect back to the main page
      navigate('/tablet');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      {!showCamera ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Field */}
            <label className="block">
              <span className="text-gray-700">Tanggal:</span>
              <input
                type="date"
                name="visitor_date"
                min={today}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            {/* Visitor Name */}
            <label className="block">
              <span className="text-gray-700">Nama:</span>
              <input
                type="text"
                name="visitor_name"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            {/* Visitor From */}
            <label className="block">
              <span className="text-gray-700">Dari:</span>
              <input
                type="text"
                name="visitor_from"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            {/* Visitor Needs */}
            <label className="block">
              <span className="text-gray-700">Keperluan:</span>
              <select
                name="visitor_needs"
                onChange={handleChange}
                required
                defaultValue=""
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select a need
                </option>
                <option value="Meeting">Meeting</option>
                <option value="Delivery">Delivery</option>
                <option value="Contractor">Contractor</option>
              </select>
            </label>

            {/* Visitor Host with Autocomplete */}
            <label className="block relative">
              <span className="text-gray-700">Bertemu:</span>
              <input
                type="text"
                name="visitor_host"
                value={formData.visitor_host}
                onChange={handleVisitorHostChange}
                required
                autoComplete="off"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 max-h-40 w-full overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name} - {suggestion.department}
                    </li>
                  ))}
                </ul>
              )}
            </label>

            {/* Visitor Amount */}
            <label className="block">
              <span className="text-gray-700">Jumlah Tamu:</span>
              <input
                type="number"
                name="visitor_amount"
                min="1"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            {/* Visitor Vehicle */}
            <label className="block">
              <span className="text-gray-700">No Polisi:</span>
              <input
                type="text"
                name="visitor_vehicle"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <CameraCapture onCapture={handleImageCapture} />
        </div>
      )}
    </div>
  );
};

export default CheckInForm;
