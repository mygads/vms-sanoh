import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVisitorPrintData, Visitor } from '../../services/apiService';
import QRCode from 'qrcode';
// import logoSanoh from '/logo-sanoh.png'; // Adjust the path as needed

const PrintReceipt: React.FC = () => {
  const { visitorId } = useParams<{ visitorId: string }>();
  const navigate = useNavigate();
  const [visitorData, setVisitorData] = useState<Visitor | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
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

          // Load logo image and convert to Data URL
          const response = await fetch('/logo-sanoh.png'); // Adjust the path if needed
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoDataUrl(reader.result as string);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error fetching visitor data or loading images:', error);
        }
      }
    };

    fetchVisitorData();
  }, [visitorId]);

  useEffect(() => {
    const printWithQZTray = async () => {
      if (visitorData && qrCodeDataUrl && logoDataUrl && !isPrinting) {
        setIsPrinting(true);

        // Initialize QZ Tray
        const qz = (window as any).qz;

        if (!qz) {
          alert('QZ Tray is not loaded. Please ensure qz-tray.js is included.');
          setIsPrinting(false);
          return;
        }

        // Set the proper Promise type
        qz.api.setPromiseType((resolver: (value?: unknown) => void) => new Promise(resolver));

        // Setup security promises
        qz.security.setCertificatePromise((resolve: (value?: unknown) => void) => {
          resolve();
        });

        qz.security.setSignaturePromise(() => {
          return (resolve: (value?: unknown) => void) => {
            resolve();
          };
        });

        try {
          // Connect to QZ Tray
          await qz.websocket.connect();

          // Get the default printer
          const printer = await qz.printers.getDefault();
          console.log('Default printer:', printer);

          // Create printer config
          const config = qz.configs.create(printer, {
            encoding: 'UTF-8',
            copies: 1,
            density: 1,
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            paperSize: { width: '3.15in', height: '6.30in' },
          });

          // Generate receipt HTML
          const receiptHtml = renderReceiptHtml(visitorData, qrCodeDataUrl, logoDataUrl);

          // Prepare print data
          const data = [
            {
              type: 'html',
              format: 'plain',
              data: receiptHtml,
            },
          ];

          // Print
          await qz.print(config, data);
          console.log('Print job submitted successfully');

        } catch (err) {
          console.error('QZ Tray error:', err);
          alert(`Printing error: ${err}`);
        } finally {
          // Cleanup
          if (qz.websocket.isActive()) {
            await qz.websocket.disconnect();
          }
          setIsPrinting(false);
          navigate('/tablet');
        }
      }
    };

    printWithQZTray();
  }, [visitorData, qrCodeDataUrl, logoDataUrl, isPrinting, navigate]);

  const renderReceiptHtml = (
    visitorData: Visitor,
    qrCodeDataUrl: string,
    logoDataUrl: string
  ) => {
    return `
      <div style="width: 3.15in; height: 6.30in; padding: 3px; background-color: #FFFFFF;">
        <img src="${logoDataUrl}" style="width: 72px; display: block; margin: 0 auto 10px;" />
        <img src="${qrCodeDataUrl}" style="width: 60px; height: 60px; display: block; margin: 0 auto 5px;" />
        <div style="text-align: center; color: #1F2937; font-size: 20px; font-weight: bold; margin-bottom: 5px;">
          ${visitorData.visitor_id}
        </div>
        <div style="margin-bottom: 5px;">
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">Tanggal Masuk</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_checkin}</div>
          </div>
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">Nama Tamu</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_name}</div>
          </div>
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">Nama Perusahaan</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_from}</div>
          </div>
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">Bertemu</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_host} - ${visitorData.department}</div>
          </div>
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">Tujuan</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_needs}</div>
          </div>
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">Jumlah Tamu</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_amount}</div>
          </div>
          <div style="display: flex; margin-bottom: 4px;">
            <div style="font-size: 10px; color: #374151; font-weight: bold; width: 40%;">No Kendaraan</div>
            <div style="font-size: 10px; color: #374151; width: 60%;">: ${visitorData.visitor_vehicle}</div>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <div style="text-align: center; font-weight: bold; margin-bottom: 5px;">TANDA TANGAN</div>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 30%; text-align: center;">
              <div style="font-size: 8px; color: #6B7280; margin-bottom: 40px;">Visitor</div>
              <div style="border-top: 1px solid #4B5563; width: 100%;"></div>
            </div>
            <div style="width: 30%; text-align: center;">
              <div style="font-size: 8px; color: #6B7280; margin-bottom: 40px;">Penerima Tamu</div>
              <div style="border-top: 1px solid #4B5563; width: 100%;"></div>
            </div>
            <div style="width: 30%; text-align: center;">
              <div style="font-size: 8px; color: #6B7280; margin-bottom: 40px;">Security</div>
              <div style="border-top: 1px solid #4B5563; width: 100%;"></div>
            </div>
          </div>
        </div>
        <div style="text-align: center; font-size: 8px; color: #374151; margin-top: 10px;">
          <div style="font-weight: bold;">Dilarang mengambil gambar atau foto di area perusahaan tanpa izin</div>
          <div style="font-style: italic;">(Taking pictures or photos in the company area without permission is prohibited)</div>
        </div>
        <div style="text-align: center; font-size: 8px; color: #374151; margin-top: 5px;">
          <div style="font-weight: bold;">NOTE: Form harus kembali ke pos security</div>
          <div style="font-style: italic;">(Please return this form to security post)</div>
        </div>
      </div>
    `;
  };

  return null;
};

export default PrintReceipt;