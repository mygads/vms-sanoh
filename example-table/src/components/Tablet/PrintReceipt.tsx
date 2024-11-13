import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import html2pdf from 'html2pdf.js';
import axios from 'axios';
import logoSanoh from '/logo-sanoh.png'; // Adjust the path as necessary
// import qrCodeImage from '/qrCode.png';    // Placeholder QR code image

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
    <div className="flex items-center justify-center h-screen">
      <div
        className="relative bg-white shadow-xl rounded-lg p-8 max-w-xs overflow-hidden border border-gray-200"
        style={{ width: '3in', height: '6in' }}
      >
        {/* Small Logo in Top-Left */}
        <div
          className="absolute"
          style={{ top: '20px', left: '20px' }}
        >
          <img src={logoSanoh} alt="Sanoh Logo" className="w-10 h-auto opacity-80" />
        </div>

        {/* Access Text */}
        <p className="text-center text-gray-700 text-sm mb-1 mt-6">
          Akses masuk
        </p>

        {/* QR Code */}
        {/* <div className="relative z-10 flex justify-center mb-3">
          <img
            src={
              visitorData.visitor_qr_code
                ? `http://127.0.0.1:8000/storage/${visitorData.visitor_qr_code}`
                : qrCodeImage
            }
            alt="QR Code"
            className="w-20 h-auto"
          />
        </div> */}

        {/* Visitor Number */}
        <p className="text-center text-gray-800 text-2xl font-bold mb-8">
          {visitorData && visitorData.visitor_id}
        </p>

        {/* Visitor Information */}
        {visitorData && (
          <div className="relative z-10 text-left space-y-2 mb-12">
            <p className="font-semibold text-sm text-gray-700">
              Nama: <span className="font-normal">{visitorData.visitor_name}</span>
            </p>
            <p className="font-semibold text-sm text-gray-700">
              Asal Perusahaan: <span className="font-normal">{visitorData.visitor_from}</span>
            </p>
            <p className="font-semibold text-sm text-gray-700">
              Host: <span className="font-normal">{visitorData.visitor_host}</span>
            </p>
            <p className="font-semibold text-sm text-gray-700">
              Keperluan: <span className="font-normal">{visitorData.visitor_needs}</span>
            </p>
            <p className="font-semibold text-sm text-gray-700">
              Jumlah Tamu: <span className="font-normal">{visitorData.visitor_amount}</span>
            </p>
          </div>
        )}

        {/* Signature Section */}
        <div className="relative z-10">
          <p className="font-semibold text-center mb-4 text-gray-700">Tanda Tangan</p>
          <div className="flex justify-between mt-2 space-x-2">
            <div className="text-center w-24">
              <div className="mb-2 text-sm text-gray-600">Security</div>
              <div className="border-b border-gray-600 w-full mx-auto mt-10"></div>
            </div>
            <div className="text-center w-24">
              <div className="mb-2 text-sm text-gray-600">Visitor</div>
              <div className="border-b border-gray-600 w-full mx-auto mt-10"></div>
            </div>
            <div className="text-center w-24">
              <div className="mb-2 text-sm text-gray-600">Host</div>
              <div className="border-b border-gray-600 w-full mx-auto mt-10"></div>
            </div>
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
