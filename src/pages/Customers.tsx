
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CustomerList from '@/components/customers/CustomerList';
import { customers } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const Customers = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer accounts</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>
      
      <CustomerList customers={customers} />
    </DashboardLayout>
  );
};

export default Customers;
