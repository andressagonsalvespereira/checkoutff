
import React from 'react';
import { Order } from '@/types/order';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomerInfoCard from './modal/CustomerInfoCard';
import OrderDetailsCard from './modal/OrderDetailsCard';
import CardDetailsSection from './modal/CardDetailsSection';
import PixDetailsSection from './modal/PixDetailsSection';
import { formatFullDate } from './utils/dateUtils';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose 
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Pedido #{String(order.id).substring(0, 8)}</DialogTitle>
          <DialogDescription>
            Pedido realizado em {formatFullDate(order.orderDate || new Date().toISOString())}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <CustomerInfoCard customer={order.customer} />
          
          <div className="flex flex-col">
            <OrderDetailsCard order={order} />
            
            {order.paymentMethod === 'CREDIT_CARD' && order.cardDetails && (
              <CardDetailsSection cardDetails={order.cardDetails} />
            )}

            {order.paymentMethod === 'PIX' && order.pixDetails && (
              <PixDetailsSection 
                pixDetails={order.pixDetails} 
                paymentStatus={order.paymentStatus} 
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
