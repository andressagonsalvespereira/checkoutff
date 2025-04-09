// src/pages/PixPaymentAsaas.tsx

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { isConfirmedStatus, isRejectedStatus, resolveManualStatus } from '@/contexts/order/utils/paymentStatus';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PixPaymentAsaas() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let interval: NodeJS.Timeout;

    const pollOrderStatus = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('product_name', decodeURIComponent(slug))
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return;

      const normalizedStatus = resolveManualStatus(data.payment_status);

      if (isConfirmedStatus(normalizedStatus)) {
        navigate('/payment-success', { state: { orderData: data } });
      } else if (isRejectedStatus(normalizedStatus)) {
        navigate('/payment-failed', { state: { orderData: data } });
      } else {
        // Se ainda estiver pendente, aguarda
        setLoading(false);
      }
    };

    pollOrderStatus(); // Primeira execução imediata
    interval = setInterval(pollOrderStatus, 4000); // Poll a cada 4s

    return () => clearInterval(interval); // Limpa quando sair da página
  }, [slug, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-8">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">Aguardando confirmação do pagamento...</p>
      <p className="text-muted-foreground text-sm mt-2">Assim que o pagamento for identificado, você será redirecionado automaticamente.</p>
    </div>
  );
}
