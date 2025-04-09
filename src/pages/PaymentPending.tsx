// src/pages/PaymentPending.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { logger } from '@/utils/logger';

const PaymentPending = () => {
  const { state } = useLocation();

  React.useEffect(() => {
    logger.log('[PaymentPending] Mounted with state:', state);
  }, [state]);

  const order = state?.orderData;

  return (
    <CheckoutContainer>
      <Card className="border-yellow-200 bg-yellow-50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
            </div>

            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Pagamento em Análise
            </h2>

            <p className="text-yellow-700 mb-4">
              Seu pagamento está sendo processado e aguarda confirmação.
            </p>

            {order && (
              <div className="w-full max-w-md bg-white rounded-lg p-4 mb-4 shadow-sm text-left text-sm text-gray-700">
                <h3 className="font-medium mb-2">Resumo do Pedido</h3>
                <ul className="space-y-1">
                  <li><strong>Produto:</strong> {order.productName}</li>
                  <li><strong>Preço:</strong> R$ {Number(order.productPrice).toFixed(2)}</li>
                  <li><strong>Cliente:</strong> {order.customerName}</li>
                  <li><strong>Email:</strong> {order.customerEmail}</li>
                  <li><strong>Status:</strong> {order.status}</li>
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Você receberá uma confirmação por e-mail assim que o pagamento for aprovado.
              Este processo pode levar alguns minutos dependendo da operadora.
            </p>
          </div>
        </CardContent>
      </Card>
    </CheckoutContainer>
  );
};

export default PaymentPending;
