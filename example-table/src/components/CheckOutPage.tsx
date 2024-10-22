import React, { useEffect, useState } from 'react';
import { fetchVisitorData, Visitor } from '../services/apiService';
import '../styles.css';

const CheckOutPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchVisitorData();
      setVisitors(data);
    };
    getData();
  }, []);

  return (
    <div className="table-page">
      <h2>Visitor Check-out</h2>
      <table className="visitor-table">
        <thead>
          <tr>
            <th>Image</th> {/* Changed from "ID" to "Image" */}
            <th>Name</th>
            <th>From</th>
            <th>Host</th>
            <th>Needs</th>
            <th>Amount</th>
            <th>Vehicle</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.visitor_id}>
              <td>
                {/* Display the visitor's image */}
                <img
                  src={`http://127.0.0.1:8000/storage/${visitor.visitor_img}`}
                  alt={`Visitor ${visitor.visitor_name}`}
                  style={{ width: '100px', height: '100px' }}
                />
              </td>
              <td>{visitor.visitor_name}</td>
              <td>{visitor.visitor_from}</td>
              <td>{visitor.visitor_host}</td>
              <td>{visitor.visitor_needs}</td>
              <td>{visitor.visitor_amount}</td>
              <td>{visitor.visitor_vehicle}</td>
              <td>{visitor.visitor_checkin}</td>
              <td>{visitor.visitor_checkout || 'N/A'}</td>
              <td>
                <button className="button">Check-out</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckOutPage;
