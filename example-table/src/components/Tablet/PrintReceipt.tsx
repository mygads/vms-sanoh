import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVisitorPrintData, Visitor } from '../../services/apiService';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import logoSanoh from '/logo-sanoh.png'; // Adjust the path as needed

const styles = StyleSheet.create({
  page: {
    width: '3.15in',
    height: '6.30in',
    padding: 3,
    backgroundColor: '#FFFFFF',
    marginRight: '8mm',
    // border: '2px solid #D1D5DB',
  },
  logo: {
    width: 72, // Approximate 'w-24' size
    alignSelf: 'center',
    marginBottom: 10,
  },
  qrCode: {
    alignSelf: 'center',
    marginBottom: 5,
  },
  visitorId: {
    textAlign: 'center',
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoContainer: {
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    fontSize: 10,
    color: '#374151',
    width: '60%',
  },
  signatureSection: {
    marginTop: 10,
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#374151',
    marginBottom: 5,
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '30%',
    alignItems: 'center',
  },
  signatureLabel: {
    alignItems: 'center',
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 25,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    width: '100%',
    marginTop: 'auto',
  },
  notice: {
    textAlign: 'center',
    fontSize: 8,
    color: '#374151',
    marginTop: 10,
  },
  italicText: {
    fontStyle: 'italic',
  },
});

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
    const printDocument = async () => {
      if (visitorData && qrCodeDataUrl && !isPrinting) {
        setIsPrinting(true);
        const blob = await pdf(<MyDocument />).toBlob();
        const url = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
            setIsPrinting(false);
            navigate('/tablet'); // Redirect to /tablet after printing
          }, 5000);
        };
      }
    };

    printDocument();
  }, [visitorData, qrCodeDataUrl, isPrinting, navigate]);

  if (!visitorData || !qrCodeDataUrl) {
    return <div>Loading...</div>;
  }

  const MyDocument = () => (
    <Document>
      <Page size={{ width: 216, height: 432 }} style={styles.page}>
        {/* Logo */}
        <Image src={logoSanoh} style={styles.logo} />

        {/* QR Code */}
        <View style={styles.qrCode}>
          <Image src={qrCodeDataUrl} style={{ width: 60, height: 60 }} />
        </View>

        {/* Visitor ID */}
        <Text style={styles.visitorId}>{visitorData!.visitor_id}</Text>

        {/* Visitor Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tanggal Masuk</Text>
            <Text style={styles.value}>: {visitorData!.visitor_checkin}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama Tamu</Text>
            <Text style={styles.value}>: {visitorData!.visitor_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama Perusahaan</Text>
            <Text style={styles.value}>: {visitorData!.visitor_from}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bertemu</Text>
            <Text style={styles.value}>
              : {visitorData!.visitor_host} - {visitorData!.department}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tujuan</Text>
            <Text style={styles.value}>: {visitorData!.visitor_needs}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Jumlah Tamu</Text>
            <Text style={styles.value}>: {visitorData!.visitor_amount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>No Kendaraan</Text>
            <Text style={styles.value}>: {visitorData!.visitor_vehicle}</Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureTitle}>TANDA TANGAN</Text>
          <View style={styles.signatureContainer}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Visitor</Text>
              <View style={styles.signatureLine}></View>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Bertemu</Text>
              <View style={styles.signatureLine}></View>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Security</Text>
              <View style={styles.signatureLine}></View>
            </View>
          </View>
        </View>

        {/* Notice */}
        <Text style={styles.notice}>
          <Text style={styles.boldText}>
            Dilarang mengambil gambar atau foto di area perusahaan tanpa izin
          </Text>
          {'\n'}
          <Text style={styles.italicText}>
            (Taking pictures or photos in the company area without permission is prohibited)
          </Text>
        </Text>

        {/* Note */}
        <Text style={styles.notice}>
          <Text style={styles.boldText}>NOTE: Form harus kembali ke pos security</Text>
          {'\n'}
          <Text style={styles.italicText}>
            (Please return this form to security post)
          </Text>
        </Text>
      </Page>
    </Document>
  );

  return null;
};

export default PrintReceipt;