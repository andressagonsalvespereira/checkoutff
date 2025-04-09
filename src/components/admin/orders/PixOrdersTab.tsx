
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Order, PaymentMethod } from '@/types/order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PixOrdersTable from './PixOrdersTable';
import EmptyOrdersState from './EmptyOrdersState';

interface PixOrdersTabProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onDeleteAllOrders: (paymentMethod: PaymentMethod) => void;
  isMobile?: boolean;
}

const PixOrdersTab: React.FC<PixOrdersTabProps> = ({
  orders,
  onViewOrder,
  onDeleteOrder,
  onDeleteAllOrders,
  isMobile = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle>Pedidos via PIX</CardTitle>
            <CardDescription>
              Lista de todos os pedidos realizados utilizando PIX
            </CardDescription>
          </div>
          {orders.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDeleteAllOrders('PIX' as PaymentMethod)}
              className="w-full md:w-auto flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir todos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <PixOrdersTable 
            orders={orders}
            onViewOrder={onViewOrder}
            onDeleteOrder={onDeleteOrder}
            isMobile={isMobile}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PixOrdersTab;
