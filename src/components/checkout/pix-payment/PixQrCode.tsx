
import React from 'react';

export interface PixQrCodeProps {
  qrCodeUrl: string;
}

const PixQrCode: React.FC<PixQrCodeProps> = ({ qrCodeUrl }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-center mb-4">QR Code PIX</h3>
      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <img 
          src={qrCodeUrl} 
          alt="QR Code PIX" 
          className="w-64 h-64 mx-auto"
        />
      </div>
    </div>
  );
};

export default PixQrCode;
