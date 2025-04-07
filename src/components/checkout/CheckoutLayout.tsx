
import React from 'react';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { useToast } from '@/hooks/use-toast';

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ children }) => {
  return (
    <CheckoutContainer>
      {children}
    </CheckoutContainer>
  );
};

export default CheckoutLayout;
