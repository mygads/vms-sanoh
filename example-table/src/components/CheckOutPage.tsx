import React, { useEffect, useState } from 'react';
import { fetchVisitorData, checkOutVisitor, Visitor } from '../services/apiService';
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

  const handleCheckOut = async (visitorId: string) => {
    try {
      await checkOutVisitor(visitorId);
      setVisitors((prevVisitors) =>
        prevVisitors.map((visitor) =>
          visitor.visitor_id === visitorId
            ? { ...visitor, visitor_checkout: new Date().toISOString() }
            : visitor
        )
      );
    } catch (error) {
      console.error('Failed to check out visitor:', error);
    }
  };

  return (
    <div className="table-page">
      <h2>Visitor Check-out</h2>
      <table className="visitor-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nama</th>
            <th>Dari</th>
            <th>Bertemu</th>
            <th>Keperluan</th>
            <th>Jumlah Tamu</th>
            <th>Nomor Kendaraan</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.visitor_id}>
              <td>
                <img
                  src={`http://127.0.0.1:8000/storage/${visitor.visitor_img}`}
                  alt={`Visitor ${visitor.visitor_name}`}
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </td>
              <td>{visitor.visitor_name}</td>
              <td>{visitor.visitor_from}</td>
              <td>{visitor.visitor_host}</td>
              <td>{visitor.visitor_needs}</td>
              <td>{visitor.visitor_amount}</td>
              <td>{visitor.visitor_vehicle}</td>
              <td>{visitor.visitor_checkin}</td>
              <td>{visitor.visitor_checkout}</td>
              <td>
                {(!visitor.visitor_checkout) && (
                  <button className="button" onClick={() => handleCheckOut(visitor.visitor_id)}>
                    Check-out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckOutPage;
