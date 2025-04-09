
import React from 'react';
import { Order } from '@/types/order';

interface OrderStatusBadgeProps {
  status: Order['paymentStatus'];
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  // Define status color mapping with defaults for all possible statuses
  const statusConfig = {
    'PENDING': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    'PAID': { color: 'bg-green-100 text-green-800', label: 'Paid' },
    'APPROVED': { color: 'bg-green-100 text-green-800', label: 'Approved' },
    'DENIED': { color: 'bg-red-100 text-red-800', label: 'Denied' },
    'ANALYSIS': { color: 'bg-blue-100 text-blue-800', label: 'Analysis' },
    'CANCELLED': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    // Fallback for any other values
    'default': { color: 'bg-gray-100 text-gray-800', label: 'Unknown Status' }
  };

  // Use the fallback if the status is undefined or not in the config
  const config = status && statusConfig[status] ? statusConfig[status] : statusConfig['default'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
