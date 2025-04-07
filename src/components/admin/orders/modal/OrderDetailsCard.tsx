
import React from 'react';
import { CreditCard, QrCode, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/order';
import OrderStatusBadge from '../OrderStatusBadge';
import { formatCurrency } from '../utils/formatUtils';

interface OrderDetailsCardProps {
  order: Order;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ order }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Produto:</dt>
            <dd>{order.productName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Preço:</dt>
            <dd>{formatCurrency(order.productPrice)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Método de Pagamento:</dt>
            <dd className="flex items-center">
              {order.paymentMethod === 'PIX' ? (
                <>
                  <QrCode className="h-4 w-4 mr-1 text-green-600" /> PIX
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-1 text-blue-600" /> Cartão de Crédito
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status:</dt>
            <dd><OrderStatusBadge status={order.paymentStatus} /></dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">ID do Pagamento:</dt>
            <dd>{order.paymentId || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Dispositivo:</dt>
            <dd className="flex items-center">
              {order.deviceType === 'mobile' ? (
                <>
                  <Smartphone className="h-4 w-4 mr-1 text-blue-600" /> 
                  <span>Dispositivo Móvel</span>
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 mr-1 text-purple-600" /> 
                  <span>Desktop</span>
                </>
              )}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
