
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrdersAdminPage } from '@/hooks/useOrdersAdminPage';

// Components
import OrdersHeader from '@/components/admin/orders/OrdersHeader';
import OrdersLoading from '@/components/admin/orders/OrdersLoading';
import PaymentMethodTabs from '@/components/admin/orders/PaymentMethodTabs';
import OrderDetailsModal from '@/components/admin/orders/OrderDetailsModal';
import DeleteOrderDialog from '@/components/admin/orders/dialogs/DeleteOrderDialog';
import DeleteAllOrdersDialog from '@/components/admin/orders/dialogs/DeleteAllOrdersDialog';

const Orders = () => {
  const isMobile = useIsMobile();
  const {
    loading,
    pixOrders,
    cardOrders,
    selectedOrder,
    isDetailsOpen,
    isRefreshing,
    isDeleteDialogOpen,
    isDeleteAllDialogOpen,
    paymentMethodToDelete,
    handleViewOrder,
    handleRefreshOrders,
    handleDeleteOrder,
    handleDeleteAllOrders,
    confirmDeleteOrder,
    confirmDeleteAllOrders,
    setIsDetailsOpen,
    setIsDeleteDialogOpen,
    setIsDeleteAllDialogOpen
  } = useOrdersAdminPage();

  // Early return for loading state
  if (loading) {
    return (
      <DashboardLayout>
        <OrdersLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OrdersHeader 
        onRefresh={handleRefreshOrders} 
        isRefreshing={isRefreshing} 
      />

      <PaymentMethodTabs 
        pixOrders={pixOrders}
        cardOrders={cardOrders}
        onViewOrder={handleViewOrder}
        onDeleteOrder={handleDeleteOrder}
        onDeleteAllOrders={handleDeleteAllOrders}
        isMobile={isMobile}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Delete Single Order Confirmation Dialog */}
      <DeleteOrderDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteOrder}
      />

      {/* Delete All Orders Confirmation Dialog */}
      <DeleteAllOrdersDialog 
        isOpen={isDeleteAllDialogOpen}
        onClose={() => setIsDeleteAllDialogOpen(false)}
        onConfirm={confirmDeleteAllOrders}
        paymentMethod={paymentMethodToDelete}
      />
    </DashboardLayout>
  );
};

export default Orders;
