
import React from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { Order, PaymentMethod } from '@/types/order';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardOrdersTab from './CardOrdersTab';
import PixOrdersTab from './PixOrdersTab';

interface PaymentMethodTabsProps {
  pixOrders: Order[];
  cardOrders: Order[];
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onDeleteAllOrders: (paymentMethod: PaymentMethod) => void;
  isMobile?: boolean;
}

const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({ 
  pixOrders, 
  cardOrders, 
  onViewOrder,
  onDeleteOrder,
  onDeleteAllOrders,
  isMobile = false
}) => {
  return (
    <Tabs defaultValue="card" className="mb-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Pedidos via Cartão ({cardOrders.length})</span>
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex items-center">
          <QrCode className="mr-2 h-4 w-4" />
          <span>Pedidos via PIX ({pixOrders.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card">
        <CardOrdersTab
          orders={cardOrders}
          onViewOrder={onViewOrder}
          onDeleteOrder={onDeleteOrder}
          onDeleteAllOrders={onDeleteAllOrders}
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="pix">
        <PixOrdersTab
          orders={pixOrders}
          onViewOrder={onViewOrder}
          onDeleteOrder={onDeleteOrder}
          onDeleteAllOrders={onDeleteAllOrders}
          isMobile={isMobile}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodTabs;
