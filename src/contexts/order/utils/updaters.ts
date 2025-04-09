
import { Order, PaymentStatus } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';
import { convertDBOrderToOrder } from './converters';

// Update order status
export const updateOrderStatusData = async (
  orders: Order[], 
  id: string | number, 
  status: PaymentStatus
): Promise<{ updatedOrder: Order; updatedOrders: Order[] }> => {
  try {
    const orderId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    // Validate the status
    const allowedStatuses = ['PENDING', 'PAID', 'APPROVED', 'DENIED', 'ANALYSIS', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid payment status: ${status}. Must be one of: ${allowedStatuses.join(', ')}`);
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }

    const updatedOrder = convertDBOrderToOrder(data);
    const updatedOrders = orders.map(order => 
      String(order.id) === String(id) ? updatedOrder : order
    );

    return { updatedOrder, updatedOrders };
  } catch (error) {
    console.error(`Failed to update order status for order ${id}:`, error);
    throw error;
  }
};
