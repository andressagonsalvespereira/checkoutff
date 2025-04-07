
import React from 'react';
import OrderSummarySection from '@/components/checkout/OrderSummarySection';
import { ProductDetailsType } from '@/components/checkout/ProductDetails';

interface OrderSummaryWrapperProps {
  productDetails: ProductDetailsType;
}

const OrderSummaryWrapper: React.FC<OrderSummaryWrapperProps> = ({ productDetails }) => {
  return <OrderSummarySection productDetails={productDetails} />;
};

export default OrderSummaryWrapper;
