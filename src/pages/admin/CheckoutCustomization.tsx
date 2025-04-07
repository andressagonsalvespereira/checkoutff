
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import CheckoutCustomizationForm from '@/components/admin/checkout-customization/CheckoutCustomizationForm';
import { CheckoutCustomizationProvider } from '@/contexts/CheckoutCustomizationContext';

const CheckoutCustomization: React.FC = () => {
  return (
    <CheckoutCustomizationProvider>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Personalização do Checkout</h1>
            <p className="text-muted-foreground">Configure a aparência da página de checkout</p>
          </div>
          
          <CheckoutCustomizationForm />
        </div>
      </AdminLayout>
    </CheckoutCustomizationProvider>
  );
};

export default CheckoutCustomization;
