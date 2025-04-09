
import React from 'react';
import { Check, AlertCircle, Clock } from 'lucide-react';

interface PaymentStatusMessageProps {
  status: string;
}

const PaymentStatusMessage: React.FC<PaymentStatusMessageProps> = ({ status }) => {
  if (status === 'CONFIRMED' || status === 'APPROVED' || status === 'PAID') {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Payment Approved</h3>
        <p className="text-gray-600 mb-4">
          Your payment has been processed successfully. Thank you for your purchase!
        </p>
      </div>
    );
  }
  
  if (status === 'PENDING' || status === 'AWAITING_PAYMENT' || status === 'ANALYSIS') {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {status === 'ANALYSIS' ? 'Payment Under Analysis' : 'Payment Processing'}
        </h3>
        <p className="text-gray-600 mb-4">
          {status === 'ANALYSIS' 
            ? 'Your payment has been sent for analysis. You will receive confirmation soon.' 
            : 'Your payment is being processed. You will receive confirmation soon.'}
        </p>
      </div>
    );
  }
  
  if (status === 'DECLINED' || status === 'FAILED' || status === 'DENIED' || status === 'CANCELLED') {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Payment Declined</h3>
        <p className="text-gray-600 mb-4">
          Unfortunately your payment was declined. Please verify your card details or try another payment method.
        </p>
      </div>
    );
  }
  
  return null;
};

export default PaymentStatusMessage;
