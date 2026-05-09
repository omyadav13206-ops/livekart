/**
 * reviewService.ts — Product reviews ke liye operations
 * getReviews, addReview, updateReview, deleteReview
 */

import { supabase } from '../lib/supabase';
import type { Review } from '../data/reviews';

function dbRowToReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    reviewerName: row.reviewer_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(dbRowToReview);
}

export async function addReview(params: {
  productId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: params.productId,
      reviewer_id: params.reviewerId,
      reviewer_name: params.reviewerName,
      rating: params.rating,
      comment: params.comment,
    })
    .select()
    .single();
  if (error) throw error;
  await updateProductRating(params.productId);
  return dbRowToReview(data);
}

async function updateProductRating(productId: string): Promise<void> {
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId);
  if (!data || data.length === 0) return;
  const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  await supabase
    .from('products')
    .update({ rating: Math.round(avgRating * 10) / 10 })
    .eq('id', productId);
}

export async function deleteReview(reviewId: string, reviewerId: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('reviewer_id', reviewerId);
  if (error) throw error;
}
