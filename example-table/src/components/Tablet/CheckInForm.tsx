import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

const CheckInForm: React.FC = () => {
  // Define today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<VisitorData>({
    visitor_date: today, // Set default date to today
    visitor_name: '',
    visitor_from: '',
    visitor_host: '',
    visitor_needs: '',
    visitor_amount: 1,
    visitor_vehicle: '',
    department: '',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suggestions, setSuggestions] = useState<Employee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'visitor_needs') {
      if (value === 'Delivery') {
        updatedFormData.visitor_host = 'Warehouse';
        updatedFormData.department = '';
        setSuggestions([]);
      } else {
        if (updatedFormData.visitor_host === 'Warehouse') {
          updatedFormData.visitor_host = '';
          updatedFormData.department = '';
        }
      }
    }

    setFormData(updatedFormData);
  };

  const handleVisitorHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.visitor_needs === 'Delivery') {
      return; // Do nothing if visitor_needs is 'Delivery'
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const visitorData = { ...formData, department: formData.department || '' };

    try {
      await submitVisitorData(visitorData);
      console.log('Data submitted successfully');
      navigate('/tablet');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Tanggal:</span>
            <input
              type="date"
              name="visitor_date"
              min={today}
              value={formData.visitor_date} // Set value to formData.visitor_date
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>

          {/* Rest of your form fields */}

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
              readOnly={formData.visitor_needs === 'Delivery'}
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

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckInForm;
