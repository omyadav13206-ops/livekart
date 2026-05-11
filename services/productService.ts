/**
 * productService.ts — All CRUD operations for Products
 * getAll, getById, getBySeller, add, update, delete, search
 */

import { supabase } from '../lib/supabase';
import type { Product } from '../data/products';

/** Convert DB row to app Product type */
function dbRowToProduct(row: any): Product {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    sellerRating: row.seller_rating,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    price: row.price,
    distance: row.distance ?? '—',
    locality: row.locality,
    rating: row.rating,
    image: row.image_url ?? 'https://via.placeholder.com/220',
    stockStatus: row.stock_status,
  };
}

/** Fetch all products (buyer feed) */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToProduct);
}

/** Fetch Product by ID */
export async function getProductById(productId: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return dbRowToProduct(data);
}

/** Fetch all products by a single seller */
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToProduct);
}

/** Filter by Category */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('rating', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToProduct);
}

/** Text search — name, category, locality */
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(
      `name.ilike.%${query}%,category.ilike.%${query}%,locality.ilike.%${query}%`
    )
    .order('rating', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToProduct);
}

type ProductDraft = {
  name: string;
  price: number;
  description: string;
  category: string;
  shortDescription?: string;
  imageUrl?: string;
};

/** Add new product */
export async function addProduct(
  sellerId: string,
  sellerName: string,
  sellerRating: number,
  locality: string,
  draft: ProductDraft
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: sellerId,
      seller_name: sellerName,
      seller_rating: sellerRating,
      name: draft.name,
      short_description: draft.shortDescription ?? draft.description.slice(0, 55),
      description: draft.description,
      category: draft.category,
      price: draft.price,
      locality,
      rating: 0,
      stock_status: 'in-stock',
      image_url: draft.imageUrl ?? 'https://via.placeholder.com/220',
    })
    .select()
    .single();

  if (error) throw error;
  return dbRowToProduct(data);
}

/** Update product */
export async function updateProduct(
  productId: string,
  sellerId: string,
  draft: ProductDraft
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: draft.name,
      short_description: draft.shortDescription ?? draft.description.slice(0, 55),
      description: draft.description,
      category: draft.category,
      price: draft.price,
      ...(draft.imageUrl ? { image_url: draft.imageUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .eq('seller_id', sellerId)
    .select()
    .single();

  if (error) throw error;
  return dbRowToProduct(data);
}

/** Delete product */
export async function deleteProduct(productId: string, sellerId: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('seller_id', sellerId); // Only delete your own product

  if (error) throw error;
}

/** Update stock status */
export async function updateStockStatus(
  productId: string,
  sellerId: string,
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock'
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ stock_status: stockStatus, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('seller_id', sellerId);

  if (error) throw error;
}

/** Subscribe for real-time products updates */
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const channel = supabase
    .channel('products-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
      const updated = await getAllProducts();
      callback(updated);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}
