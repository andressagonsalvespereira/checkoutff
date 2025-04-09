
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface OrdersHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">Gerenciamento de todos os pedidos realizados</p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="flex items-center"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
