import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVisitorPrintData, Visitor } from '../../services/apiService';
import { renderToString } from 'react-dom/server';
import QRCode from 'qrcode';

// Import styles if using CSS modules or adjust accordingly
import logoSanoh from '/logo-sanoh.png'; // Adjust the path as needed

const PrintReceipt: React.FC = () => {
  const { visitorId } = useParams<{ visitorId: string }>();
  const navigate = useNavigate();
  const [visitorData, setVisitorData] = useState<Visitor | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  useEffect(() => {
    const fetchVisitorData = async () => {
      if (visitorId) {
        try {
          const data = await getVisitorPrintData(visitorId);
          setVisitorData(data);

          // Generate QR code data URL
          const qrCodeUrl = await QRCode.toDataURL(visitorId, { margin: 0 });
          setQrCodeDataUrl(qrCodeUrl);
        } catch (error) {
          console.error('Error fetching visitor data:', error);
        }
      }
    };

    fetchVisitorData();
  }, [visitorId]);

  useEffect(() => {
    const printWithQZTray = async () => {
      if (visitorData && qrCodeDataUrl && !isPrinting) {
        setIsPrinting(true);

        // Initialize QZ Tray
        const qz = (window as any).qz;

        if (!qz) {
          alert('QZ Tray is not loaded. Please ensure qz-tray.js is included.');
          setIsPrinting(false);
          return;
        }

        qz.api.setPromiseType(window.Promise);

        // For secure printing, you may need to set up certificate and signature
        qz.security.setCertificatePromise(function (resolve: any) {
          // Resolve with your certificate information
          resolve();
        });

        qz.security.setSignaturePromise(function () {
          return function (resolve: any) {
            // Sign the toSign data and resolve
            resolve();
          };
        });

        // Connect to QZ Tray
        try {
          await qz.websocket.connect();
        } catch (err) {
          console.error('Failed to connect to QZ Tray:', err);
          setIsPrinting(false);
          return;
        }

        // Find the printer
        let printer;
        try {
          printer = await qz.printers.find("Iware IW-J200BT"); // Adjust with your printer's name
        } catch (err) {
          console.error('Printer not found:', err);
          alert('Printer not found. Please ensure it is connected and paired.');
          setIsPrinting(false);
          return;
        }

        // Prepare print data
        const config = qz.configs.create(printer, {
          encoding: 'GB18030', // Adjust encoding if necessary
          /* Additional printer configurations can go here */
        });

        // Generate the receipt content as HTML string
        const receiptHtml = renderReceiptHtml(visitorData, qrCodeDataUrl);

        // Prepare the print data
        const data = [
          {
            type: 'html',
            format: 'plain',
            data: receiptHtml,
          },
        ];

        // Send the print job
        try {
          await qz.print(config, data);
          console.log('Print job submitted successfully');
        } catch (err) {
          console.error('Failed to print:', err);
          alert('Failed to print: ' + err);
        } finally {
          // Disconnect from QZ Tray
          await qz.websocket.disconnect();
          setIsPrinting(false);
          navigate('/tablet'); // Redirect after printing
        }
      }
    };

    printWithQZTray();
  }, [visitorData, qrCodeDataUrl, isPrinting, navigate]);

  if (!visitorData || !qrCodeDataUrl) {
    return <div>Loading...</div>;
  }

  // Function to generate the receipt HTML content
  const renderReceiptHtml = (visitor: Visitor, qrCodeUrl: string) => {
    return renderToString(
      <div style={{ width: '2.8in', fontFamily: 'Arial, sans-serif', fontSize: '10px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <img src={logoSanoh} alt="Logo" style={{ width: '72px', marginBottom: '10px' }} />
        </div>

        {/* QR Code */}
        <div style={{ textAlign: 'center', marginBottom: '5px' }}>
          <img src={qrCodeUrl} alt="QR Code" style={{ width: '60px', height: '60px' }} />
        </div>

        {/* Visitor ID */}
        <div style={{ textAlign: 'center', color: '#1F2937', fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
          {visitor.visitor_id}
        </div>

        {/* Visitor Information */}
        <div style={{ marginBottom: '5px' }}>
          <div><strong>Tanggal Masuk:</strong> {visitor.visitor_checkin}</div>
          <div><strong>Nama Tamu:</strong> {visitor.visitor_name}</div>
          <div><strong>Nama Perusahaan:</strong> {visitor.visitor_from}</div>
          <div><strong>Bertemu:</strong> {visitor.visitor_host} - {visitor.department}</div>
          <div><strong>Tujuan:</strong> {visitor.visitor_needs}</div>
          <div><strong>Jumlah Tamu:</strong> {visitor.visitor_amount}</div>
          <div><strong>No Kendaraan:</strong> {visitor.visitor_vehicle}</div>
        </div>

        {/* Signature Section */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>TANDA TANGAN</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '30%', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#6B7280', marginBottom: '40px' }}>Visitor</div>
              <div style={{ borderTop: '1px solid #4B5563', width: '100%' }}></div>
            </div>
            <div style={{ width: '30%', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#6B7280', marginBottom: '40px' }}>Penerima Tamu</div>
              <div style={{ borderTop: '1px solid #4B5563', width: '100%' }}></div>
            </div>
            <div style={{ width: '30%', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#6B7280', marginBottom: '40px' }}>Security</div>
              <div style={{ borderTop: '1px solid #4B5563', width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div style={{ textAlign: 'center', fontSize: '8px', color: '#374151', marginTop: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>
            Dilarang mengambil gambar atau foto di area perusahaan tanpa izin
          </div>
          <div style={{ fontStyle: 'italic' }}>
            (Taking pictures or photos in the company area without permission is prohibited)
          </div>
        </div>

        {/* Note */}
        <div style={{ textAlign: 'center', fontSize: '8px', color: '#374151', marginTop: '5px' }}>
          <div style={{ fontWeight: 'bold' }}>
            NOTE: Form harus kembali ke pos security
          </div>
          <div style={{ fontStyle: 'italic' }}>
            (Please return this form to security post)
          </div>
        </div>
      </div>
    );
  };

  return null; // Since the component handles printing, no need to render anything
};

export default PrintReceipt;