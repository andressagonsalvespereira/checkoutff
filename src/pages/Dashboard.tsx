
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import VisitorStats from '@/components/dashboard/VisitorStats';
import PaymentStats from '@/components/dashboard/PaymentStats';
import VisitorsChart from '@/components/dashboard/VisitorsChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import { transactions } from '@/utils/mockData';
import { getPaymentSummary, generateVisitorData, generateDateLabels } from '@/utils/dashboardUtils';

const Dashboard = () => {
  // Get payment summary data
  const paymentSummary = getPaymentSummary();
  
  // Generate visitor data for chart
  const visitorsData = generateDateLabels(7).map((date, index) => ({
    name: date,
    visitors: Math.floor(Math.random() * 100) + 20,
  }));
  
  // Payment methods distribution data
  const paymentMethodsData = [
    { name: 'Cartão de Crédito', value: 60 },
    { name: 'PIX', value: 40 }
  ];

  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Estatísticas de Visitantes</h2>
        <VisitorStats />
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Estatísticas de Pagamento</h2>
        <PaymentStats 
          pixGenerated={paymentSummary.pixGenerated}
          pixCompleted={paymentSummary.pixCompleted}
          cardCaptured={paymentSummary.cardCaptured}
          totalValue={paymentSummary.totalValue}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Tendência de Visitantes</h2>
          <VisitorsChart visitorsData={visitorsData} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Métodos de Pagamento</h2>
          <PaymentMethodsChart data={paymentMethodsData} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Transações Recentes</h2>
        <RecentTransactions transactions={transactions} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
