import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import {
  isConfirmedStatus,
  isRejectedStatus,
  resolveManualStatus,
} from '@/contexts/order/utils/resolveManualStatus';
import { Order } from '@/types/database';

export default function PixPaymentAsaas() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  const orderData = location.state?.orderData as Order | undefined;

  useEffect(() => {
    if (!orderData?.id) return;

    let interval: NodeJS.Timeout;

    const pollOrderStatus = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderData.id)
        .single();

      if (error || !data) {
        console.error('Erro ao buscar pedido:', error);
        return;
      }

      const normalizedStatus = resolveManualStatus(data.payment_status);

      if (isConfirmedStatus(normalizedStatus)) {
        navigate('/payment-success', { state: { orderData: data } });
      } else if (isRejectedStatus(normalizedStatus)) {
        navigate('/payment-failed', { state: { orderData: data } });
      } else {
        setOrder(data); // mantém dados atualizados
        setLoading(false);
      }
    };

    pollOrderStatus();
    interval = setInterval(pollOrderStatus, 4000);

    return () => clearInterval(interval);
  }, [orderData?.id, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-8">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">Aguardando confirmação do pagamento...</p>
      <p className="text-muted-foreground text-sm mt-2">
        Assim que o pagamento for identificado, você será redirecionado automaticamente.
      </p>
    </div>
  );
}
