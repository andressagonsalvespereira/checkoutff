
import React from 'react';
import { Order, PaymentStatus } from '@/types/order';
import { formatDate } from '../utils/formatUtils';

interface PixDetailsSectionProps {
  pixDetails: NonNullable<Order['pixDetails']>;
  paymentStatus: Order['paymentStatus'];
}

const PixDetailsSection: React.FC<PixDetailsSectionProps> = ({ pixDetails, paymentStatus }) => {
  // Determine if we should show the QR code based on payment status
  const showQrCode = paymentStatus === 'PENDING' || 
                     paymentStatus === 'ANALYSIS';

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-medium mb-2">Dados do PIX</h4>
      {showQrCode && pixDetails.qrCodeImage && (
        <div className="flex justify-center mb-4">
          <img 
            src={pixDetails.qrCodeImage} 
            alt="QR Code PIX" 
            className="w-48 h-48"
          />
        </div>
      )}
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Código PIX:</dt>
          <dd className="break-all text-xs">{pixDetails.qrCode}</dd>
        </div>
        {pixDetails.expirationDate && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Validade:</dt>
            <dd>{formatDate(pixDetails.expirationDate)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default PixDetailsSection;
