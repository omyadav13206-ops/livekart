/**
 * Local Baazar — Supabase Database Types
 * Ye types Supabase ke saare tables ke saath match karti hain
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          seller_rating: number;
          buyer_rating: number;
          locality: string | null;
          joined_since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar_url?: string | null;
          seller_rating?: number;
          buyer_rating?: number;
          locality?: string | null;
          joined_since?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          seller_rating?: number;
          buyer_rating?: number;
          locality?: string | null;
          joined_since?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          seller_name: string;
          seller_rating: number;
          name: string;
          short_description: string;
          description: string;
          category: string;
          price: number;
          distance: string | null;
          locality: string;
          rating: number;
          image_url: string | null;
          stock_status: 'in-stock' | 'low-stock' | 'out-of-stock';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          seller_name: string;
          seller_rating?: number;
          name: string;
          short_description: string;
          description: string;
          category: string;
          price: number;
          distance?: string | null;
          locality: string;
          rating?: number;
          image_url?: string | null;
          stock_status?: 'in-stock' | 'low-stock' | 'out-of-stock';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          seller_id?: string;
          seller_name?: string;
          seller_rating?: number;
          name?: string;
          short_description?: string;
          description?: string;
          category?: string;
          price?: number;
          distance?: string | null;
          locality?: string;
          rating?: number;
          image_url?: string | null;
          stock_status?: 'in-stock' | 'low-stock' | 'out-of-stock';
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          product_id: string;
          product_name: string;
          buyer_id: string;
          buyer_name: string;
          seller_id: string;
          seller_name: string;
          quantity: number;
          price: number;
          delivery_method: 'delivery' | 'pickup';
          status: 'pending' | 'shipped' | 'delivered' | 'picked-up' | 'cancelled';
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_name: string;
          buyer_id: string;
          buyer_name: string;
          seller_id: string;
          seller_name: string;
          quantity: number;
          price: number;
          delivery_method: 'delivery' | 'pickup';
          status?: 'pending' | 'shipped' | 'delivered' | 'picked-up' | 'cancelled';
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'shipped' | 'delivered' | 'picked-up' | 'cancelled';
          updated_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          product_id?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          reviewer_id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          reviewer_id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          participant_one_id: string;
          participant_two_id: string;
          last_message: string | null;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_one_id: string;
          participant_two_id: string;
          last_message?: string | null;
          last_message_at?: string | null;
          created_at?: string;
        };
        Update: {
          last_message?: string | null;
          last_message_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
      live_sessions: {
        Row: {
          id: string;
          host_id: string;
          host_name: string;
          title: string;
          cover_image: string | null;
          locality: string;
          viewers: number;
          is_active: boolean;
          product_id: string | null;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          host_name: string;
          title: string;
          cover_image?: string | null;
          locality: string;
          viewers?: number;
          is_active?: boolean;
          product_id?: string | null;
          started_at?: string;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          cover_image?: string | null;
          viewers?: number;
          is_active?: boolean;
          product_id?: string | null;
          ended_at?: string | null;
        };
      };
    };
  };
};
