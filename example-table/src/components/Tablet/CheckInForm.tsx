import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from './CameraCapture';
import { submitVisitorData } from '../../services/apiService';

interface VisitorData {
  visitor_date: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
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
  });
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Check-in Form</h2>
      {!showCamera ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Tanggal:</span>
              <input
                type="date"
                name="visitor_date"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </label>
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
            <label className="block">
              <span className="text-gray-700">Bertemu:</span>
              <input
                type="text"
                name="visitor_host"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
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
            <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700">
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
