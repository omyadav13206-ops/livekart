/**
 * orderService.ts — Operations for Orders
 * placeOrder, getMyOrders, getSellerOrders, updateOrderStatus
 */

import { supabase } from '../lib/supabase';
import type { OrderItem, OrderStatus } from '../data/orders';

/** Convert DB row to app OrderItem type */
function dbRowToOrder(row: any): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    date: row.date,
    price: row.price,
    sellerName: row.seller_name,
    buyerName: row.buyer_name,
    deliveryMethod: row.delivery_method,
    status: row.status,
  };
}

/** Place a new order */
export async function placeOrder(params: {
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  price: number;
  deliveryMethod: 'delivery' | 'pickup';
}): Promise<OrderItem> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      product_id: params.productId,
      product_name: params.productName,
      buyer_id: params.buyerId,
      buyer_name: params.buyerName,
      seller_id: params.sellerId,
      seller_name: params.sellerName,
      quantity: params.quantity,
      price: params.price,
      delivery_method: params.deliveryMethod,
      status: params.deliveryMethod === 'pickup' ? 'pending' : 'shipped',
      date: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) throw error;
  return dbRowToOrder(data);
}

/** Fetch all orders for a buyer */
export async function getBuyerOrders(buyerId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToOrder);
}

/** Fetch incoming orders for a seller */
export async function getSellerOrders(sellerId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToOrder);
}

/** Update order status (used by seller) */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) throw error;
}

/** Calculate stats for seller analytics */
export async function getSellerStats(sellerId: string): Promise<{
  totalRevenue: number;
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
}> {
  const { data, error } = await supabase
    .from('orders')
    .select('price, status, date')
    .eq('seller_id', sellerId)
    .neq('status', 'cancelled');

  if (error) throw error;

  const today = new Date().toISOString().slice(0, 10);
  const orders = data ?? [];

  return {
    totalRevenue: orders.reduce((sum, o) => sum + (o.price ?? 0), 0),
    totalOrders: orders.length,
    ordersToday: orders.filter((o) => o.date === today).length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
  };
}

/** Subscribe for real-time order updates */
export function subscribeToOrders(
  userId: string,
  role: 'buyer' | 'seller',
  callback: (orders: OrderItem[]) => void
) {
  const channel = supabase
    .channel(`orders-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
      const updated = role === 'buyer'
        ? await getBuyerOrders(userId)
        : await getSellerOrders(userId);
      callback(updated);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}
