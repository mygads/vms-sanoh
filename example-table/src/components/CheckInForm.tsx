import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from './CameraCapture';
import '../styles.css';

import { submitVisitorData } from '../services/apiService';

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
      navigate('/');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="form-page">
      <h2>Check-in Form</h2>
      {!showCamera ? (
        <form onSubmit={handleSubmit} className="form">
          <label>
            Tanggal:
            <input
              type="date"
              name="visitor_date"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nama:
            <input
              type="text"
              name="visitor_name"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Dari:
            <input
              type="text"
              name="visitor_from"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Bertemu:
            <input
              type="text"
              name="visitor_host"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Keperluan:
            <select
              name="visitor_needs"
              onChange={handleChange}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select a need
              </option>
              <option value="Meeting">Meeting</option>
              <option value="Delivery">Delivery</option>
              <option value="Contractor">Contractor</option>
            </select>
          </label>
          <label>
            Jumlah Tamu:
            <input
              type="number"
              name="visitor_amount"
              min="1"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nomor Kendaraan:
            <input
              type="text"
              name="visitor_vehicle"
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      ) : (
        <CameraCapture onCapture={handleImageCapture} />
      )}
    </div>
  );
};

export default CheckInForm;
