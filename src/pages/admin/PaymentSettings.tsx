
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PaymentSettingsForm from '@/components/admin/payment-settings/PaymentSettingsForm';

const PaymentSettings = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Configurações de Pagamento</h1>
        <p className="text-muted-foreground">Configure todas as opções de pagamento e integração com Asaas</p>
      </div>
      
      <PaymentSettingsForm />
    </AdminLayout>
  );
};

export default PaymentSettings;
