
import React from 'react';
import { Eye, Trash2, Smartphone, Monitor } from 'lucide-react';
import { Order } from '@/types/order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from './OrderStatusBadge';
import { formatDate, formatCurrency } from './utils/formatUtils';

interface CardOrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  isMobile?: boolean;
}

const CardOrdersTable: React.FC<CardOrdersTableProps> = ({
  orders,
  onViewOrder,
  onDeleteOrder,
  isMobile = false
}) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className={isMobile ? "hidden md:table-cell" : ""}>Data</TableHead>
            <TableHead className={isMobile ? "hidden md:table-cell" : ""}>Número do Cartão</TableHead>
            <TableHead className={isMobile ? "hidden lg:table-cell" : ""}>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div>{order.customer.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-[120px]">{order.customer.email}</div>
              </TableCell>
              <TableCell className="max-w-[120px] truncate">{order.productName}</TableCell>
              <TableCell>{formatCurrency(order.productPrice)}</TableCell>
              <TableCell className={isMobile ? "hidden md:table-cell" : ""}>{formatDate(order.orderDate)}</TableCell>
              <TableCell className={isMobile ? "hidden md:table-cell" : ""}>{order.cardDetails?.number}</TableCell>
              <TableCell className={isMobile ? "hidden lg:table-cell" : ""}>
                {order.cardDetails?.expiryMonth}/{order.cardDetails?.expiryYear}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.paymentStatus} />
              </TableCell>
              <TableCell>
                {order.deviceType === 'mobile' ? (
                  <div className="flex items-center text-blue-600">
                    <Smartphone className="h-4 w-4 mr-1" />
                    <span className="text-xs">Mobile</span>
                  </div>
                ) : (
                  <div className="flex items-center text-purple-600">
                    <Monitor className="h-4 w-4 mr-1" />
                    <span className="text-xs">Desktop</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewOrder(order)}
                    className="text-blue-600 hover:text-blue-800 p-1 h-8"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-1">Detalhes</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDeleteOrder(order)}
                    className="text-red-600 hover:text-red-800 p-1 h-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-1">Excluir</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CardOrdersTable;
