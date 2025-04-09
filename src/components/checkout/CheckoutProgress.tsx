
import React from 'react';
import CheckoutProgressContainer from '@/components/checkout/progress/CheckoutProgressContainer';
import { ProductDetailsType } from '@/components/checkout/ProductDetails';

interface CheckoutProgressProps {
  paymentMethod: 'card' | 'pix';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'pix'>>;
  productDetails: ProductDetailsType;
  handlePayment: (paymentData: any) => void;
  isProcessing: boolean;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = (props) => {
  console.log('CheckoutProgress rendered with props:', {
    paymentMethod: props.paymentMethod,
    productDetails: {
      id: props.productDetails.id,
      name: props.productDetails.name,
      price: props.productDetails.price,
      isDigital: props.productDetails.isDigital
    },
    isProcessing: props.isProcessing
  });
  
  return <CheckoutProgressContainer {...props} />;
};

export default CheckoutProgress;
