
import React from 'react';
import StatCard from './StatCard';
import { CreditCard, Users, ArrowUpRight, DollarSign } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your payment dashboard</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            New Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value="R$ 24,345.00"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Customers"
          value="2,340"
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Pending Payments"
          value="18"
          icon={<CreditCard className="h-5 w-5 text-primary" />}
          trend={{ value: 2.1, isPositive: false }}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
