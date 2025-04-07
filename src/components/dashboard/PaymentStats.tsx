
import React from 'react';
import { CreditCard, QrCode, DollarSign, CheckCircle } from 'lucide-react';
import StatCard from './StatCard';
import { formatCurrency } from '@/utils/dashboardDataUtils';

interface PaymentStatsProps {
  pixGenerated: number;
  pixCompleted: number;
  cardCaptured: number;
  totalValue: number;
  loading?: boolean;
}

const PaymentStats: React.FC<PaymentStatsProps> = ({ 
  pixGenerated, 
  pixCompleted, 
  cardCaptured, 
  totalValue,
  loading = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Cartões Capturados"
        value={loading ? "..." : `${cardCaptured}`}
        icon={<CreditCard className="h-5 w-5 text-indigo-500" />}
        className="border-indigo-100"
      />
      <StatCard
        title="PIX Gerados"
        value={loading ? "..." : `${pixGenerated}`}
        icon={<QrCode className="h-5 w-5 text-green-500" />}
        className="border-green-100"
      />
      <StatCard
        title="PIX Concluídos"
        value={loading ? "..." : `${pixCompleted}`}
        icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
        className="border-emerald-100"
      />
      <StatCard
        title="Valor Total"
        value={loading ? "..." : formatCurrency(totalValue)}
        icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        className="border-amber-100"
      />
    </div>
  );
};

export default PaymentStats;
