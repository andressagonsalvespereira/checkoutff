
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessMessageProps {
  paymentMethod: 'PIX' | 'CREDIT_CARD';
}

const OrderSuccessMessage: React.FC<OrderSuccessMessageProps> = ({ paymentMethod }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-4">
      <h3 className="font-semibold text-green-600 mb-2">
        Order Successfully Placed!
      </h3>
      <p className="text-gray-600 mb-4">
        {paymentMethod === 'PIX' 
          ? 'Use the PIX QR code below to complete your payment.' 
          : 'Your payment has been processed successfully. You will receive an email with the order details.'}
      </p>
      {paymentMethod === 'CREDIT_CARD' && (
        <Button
          onClick={() => navigate('/')}
          className="bg-green-600 hover:bg-green-700"
        >
          Return to home page
        </Button>
      )}
    </div>
  );
};

export default OrderSuccessMessage;
