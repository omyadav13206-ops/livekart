/**
 * wishlistService.ts — Operations for Wishlist
 * toggleWishlist, getWishlist, isInWishlist
 */

import { supabase } from '../lib/supabase';
import type { Product } from '../data/products';

/** Fetch product IDs in user's wishlist */
export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((row) => row.product_id);
}

/** Fetch all products in wishlist with details */
export async function getWishlistProducts(userId: string): Promise<Product[]> {
  const productIds = await getWishlistProductIds(userId);
  if (productIds.length === 0) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  if (error) throw error;

  return (data ?? []).map((row) => ({
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
  }));
}

/** Add product to wishlist */
export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: userId, product_id: productId });

  if (error) throw error;
}

/** Remove product from wishlist */
export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

/** Toggle — remove if exists, otherwise add */
export async function toggleWishlist(userId: string, productId: string): Promise<boolean> {
  // Check if already in wishlist
  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (data) {
    await removeFromWishlist(userId, productId);
    return false; // Removed
  } else {
    await addToWishlist(userId, productId);
    return true; // Added
  }
}

/** Check if product is in wishlist */
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  return !!data;
}
