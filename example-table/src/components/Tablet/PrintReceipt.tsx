import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import html2pdf from 'html2pdf.js';
import axios from 'axios';

export interface Visitor {
  visitor_id: string;
  visitor_date: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  visitor_checkin: string;
  visitor_checkout: string | null;
}

const ReceiptComponent: React.FC = () => {
  const { visitorId } = useParams<{ visitorId: string }>();
  const [visitorData, setVisitorData] = useState<Visitor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Visitor>(`http://127.0.0.1:8000/api/print/${visitorId}`);
        setVisitorData(response.data);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    if (visitorId) {
      fetchData();
    }
  }, [visitorId]);

  // const generatePDF = () => {
  //   const element = document.getElementById('receipt');
  //   if (element) {
  //     html2pdf().from(element).save(`visitor_${visitorId}_receipt.pdf`);
  //   }
  // };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div id="receipt-container" className="w-80 bg-white p-4 shadow-lg rounded">
        <div id="receipt" className="text-sm font-mono">
          <h2 className="text-center font-bold mb-4">Visitor Receipt</h2>
          <div id="receipt-content" className="mb-4">
            {visitorData ? (
              <>
                <p>Date: {visitorData.visitor_date}</p>
                <p>Visitor ID: {visitorData.visitor_id}</p>
                <p>Name: {visitorData.visitor_name}</p>
                <p>From: {visitorData.visitor_from}</p>
                <p>Host: {visitorData.visitor_host}</p>
                <p>Needs: {visitorData.visitor_needs}</p>
                <p>Check-in: {visitorData.visitor_checkin}</p>
                <p>Check-out: {visitorData.visitor_checkout ?? '-'}</p>
                <hr className="my-2" />
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="text-center">
            <p>Thank You for Visiting!</p>
          </div>
        </div>
        {/* <button
          onClick={generatePDF}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
        >
          Save as PDF
        </button> */}
      </div>
    </div>
  );
};

export default ReceiptComponent;
