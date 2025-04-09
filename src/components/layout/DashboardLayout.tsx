import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// This is now just a wrapper for AdminLayout to keep compatibility with existing code
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default DashboardLayout;
