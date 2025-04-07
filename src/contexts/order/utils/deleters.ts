
import { PaymentMethod } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

// Delete a single order
export const deleteOrderData = async (id: string): Promise<void> => {
  try {
    // First, delete associated payment record if exists
    const { error: paymentError } = await supabase
      .from('asaas_payments')
      .delete()
      .eq('order_id', parseInt(id, 10));
    
    if (paymentError) {
      console.error("Error deleting payment record:", paymentError);
    }
    
    // Then, delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  } catch (error) {
    console.error(`Failed to delete order ${id}:`, error);
    throw error;
  }
};

// Delete all orders by payment method
export const deleteAllOrdersByPaymentMethodData = async (method: PaymentMethod): Promise<void> => {
  try {
    // Get all orders with this payment method
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_method', method);
    
    if (fetchError) {
      throw new Error(`Error fetching orders: ${fetchError.message}`);
    }
    
    if (!orders || orders.length === 0) {
      return; // No orders to delete
    }
    
    // Extract order IDs
    const orderIds = orders.map(order => order.id);
    
    // Delete associated payment records
    const { error: paymentError } = await supabase
      .from('asaas_payments')
      .delete()
      .in('order_id', orderIds);
    
    if (paymentError) {
      console.error("Error deleting payment records:", paymentError);
    }
    
    // Delete the orders
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('payment_method', method);

    if (error) {
      throw new Error(`Error deleting orders: ${error.message}`);
    }
  } catch (error) {
    console.error(`Failed to delete orders with payment method ${method}:`, error);
    throw error;
  }
};
