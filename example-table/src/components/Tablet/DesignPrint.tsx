import React from 'react';
import logoSanoh from '/src/components/logo-sanoh.png'; // Update to correct path
import qrCodeImage from '/src/components/qrCode.png'; // Update to correct path

const VisitorCard: React.FC = () => {
    return (
        <div 
            className="relative bg-white shadow-xl rounded-lg p-8 max-w-xs overflow-hidden border border-gray-200"
            style={{ width: '3in', height: '6in' }}
        >
            {/* Small Logo in Top-Left with Specific Padding */}
            <div 
                className="absolute"
                style={{ top: '20px', left: '20px', right: '20px', bottom: '20px' }}
                >
                    <img src={logoSanoh} alt="Sanoh Logo" className="w-10 h-auto opacity-80" />
            </div>

            {/* Access Text */}
                <p className="text-center text-gray-700 text-sm mb-1">
                Akses masuk
            </p>

            {/* QR Code */}
            <div className="relative z-10 flex justify-center mb-3">
                <img src={qrCodeImage} alt="QR Code" className="w-20 h-auto" />
            </div>

            {/* Visitor Number */}
            <p className="text-center text-gray-800 text-2xl font-bold mb-8">
                MT-00027
            </p>

            {/* Visitor Information */}
            <div className="relative z-10 text-left space-y-2 mb-12">
                <p className="font-semibold text-sm text-gray-700">
                    Nama: <span className="font-normal">Kiki </span>
                </p>
                <p className="font-semibold text-sm text-gray-700">
                    Asal Perusahaan: <span className="font-normal">PT. Daihatsu</span>
                </p>
                <p className="font-semibold text-sm text-gray-700">
                    Host: <span className="font-normal">Fajar Sidik - IT</span>
                </p>
                <p className="font-semibold text-sm text-gray-700">
                    Keperluan: <span className="font-normal">Meeting</span>
                </p>
                <p className="font-semibold text-sm text-gray-700">
                    Jumlah Tamu: <span className="font-normal">3</span>
                </p>
            </div>

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
        </div>
    );
};

export default VisitorCard;
