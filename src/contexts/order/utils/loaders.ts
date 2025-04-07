
import { Order } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';
import { convertDBOrderToOrder } from './converters';

// Load all orders from the database
export const loadOrders = async (): Promise<Order[]> => {
  try {
    console.log("Carregando pedidos do banco de dados...");
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, asaas_payments(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao carregar pedidos:", error);
      throw new Error(`Error loading orders: ${error.message}`);
    }

    console.log("Pedidos carregados do banco de dados:", data);
    
    if (!data || data.length === 0) {
      console.log("Nenhum pedido encontrado no banco de dados");
      return [];
    }

    return data.map(convertDBOrderToOrder);
  } catch (error) {
    console.error('Failed to load orders:', error);
    throw error;
  }
};
