
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Order, PaymentMethod } from '@/types/order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CardOrdersTable from './CardOrdersTable';
import EmptyOrdersState from './EmptyOrdersState';

interface CardOrdersTabProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onDeleteAllOrders: (paymentMethod: PaymentMethod) => void;
  isMobile?: boolean;
}

const CardOrdersTab: React.FC<CardOrdersTabProps> = ({
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
            <CardTitle>Pedidos via Cartão de Crédito</CardTitle>
            <CardDescription>
              Lista de todos os pedidos realizados utilizando cartão de crédito
            </CardDescription>
          </div>
          {orders.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDeleteAllOrders('CREDIT_CARD' as PaymentMethod)}
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
          <CardOrdersTable 
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

export default CardOrdersTab;
