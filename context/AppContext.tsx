/**
 * AppContext.tsx — Supabase ke saath updated context
 * Saare mock data ab real Supabase calls se replace ho gaye hain
 */

import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ChatPreview } from '../data/chats';
import type { OrderItem, OrderStatus } from '../data/orders';
import type { Product } from '../data/products';
import type { Review } from '../data/reviews';
import type { UserProfile } from '../data/userProfile';
import { supabase } from '../lib/supabase';
import type { AppThemeMode, Role } from '../navigation/types';
import * as authService from '../services/authService';
import * as liveService from '../services/liveService';
import * as orderService from '../services/orderService';
import * as productService from '../services/productService';
import * as wishlistService from '../services/wishlistService';

type ProductDraft = {
  name: string;
  price: number;
  description: string;
  category: string;
  shortDescription?: string;
  imageUrl?: string;
};

type CheckoutMethod = 'delivery' | 'pickup';

type AppContextValue = {
  // Auth
  userId: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  // Role & Theme
  role: Role | null;
  setRole: (role: Role | null) => void;
  switchRole: () => void;
  themeMode: AppThemeMode;
  toggleTheme: () => void;
  // Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  // Products
  products: Product[];
  sellerProducts: Product[];
  refreshProducts: () => Promise<void>;
  // Chat
  chats: ChatPreview[];
  // Orders
  orders: OrderItem[];
  refreshOrders: () => Promise<void>;
  // Reviews
  reviews: Review[];
  // Live
  liveSessions: any[];
  currentLiveProduct: Product;
  liveUpdatePulseKey: number;
  // Selection state
  selectedProduct: Product | null;
  selectedOrder: OrderItem | null;
  selectedChat: ChatPreview | null;
  wishlistProducts: Product[];
  // Setters
  setSelectedProduct: (product: Product | null) => void;
  setSelectedOrder: (order: OrderItem | null) => void;
  setSelectedChat: (chat: ChatPreview | null) => void;
  // Actions
  addProduct: (draft: ProductDraft) => Promise<void>;
  updateProduct: (productId: string, draft: ProductDraft) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  setCurrentLiveProductById: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  placeOrder: (productId: string, method: CheckoutMethod, quantity: number) => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Fallback profile jab user logged out ho
const defaultProfile: UserProfile = {
  id: '',
  name: 'Guest User',
  avatar: 'https://via.placeholder.com/120',
  sellerRating: 0,
  buyerRating: 0,
  locality: '',
  joinedSince: '2026',
};

export function AppProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [themeMode, setThemeMode] = useState<AppThemeMode>('light');
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [currentLiveProductId, setCurrentLiveProductId] = useState<string>('');
  const [liveUpdatePulseKey, setLiveUpdatePulseKey] = useState(0);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  // ── Auth listener ──────────────────────────────────────────
  useEffect(() => {
    const subscription = authService.onAuthStateChange(async (user) => {
      if (user) {
        setUserId(user.id);
        try {
          const profile = await authService.getMyProfile(user.id);
          setUserProfile({
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar_url ?? 'https://via.placeholder.com/120',
            sellerRating: profile.seller_rating,
            buyerRating: profile.buyer_rating,
            locality: profile.locality ?? '',
            joinedSince: profile.joined_since,
          });
        } catch (e) {
          console.warn('Profile fetch failed:', e);
        }
      } else {
        setUserId(null);
        setUserProfile(defaultProfile);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load Products ──────────────────────────────────────────
  const refreshProducts = useCallback(async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      if (!currentLiveProductId && data.length > 0) {
        setCurrentLiveProductId(data[0].id);
      }
    } catch (e) {
      console.warn('Products fetch failed:', e);
    }
  }, [currentLiveProductId]);

  useEffect(() => {
    refreshProducts();
    // Real-time subscribe
    const unsubscribe = productService.subscribeToProducts(setProducts);
    return unsubscribe;
  }, []);

  // ── Load Live Sessions ─────────────────────────────────────
  useEffect(() => {
    liveService.getActiveLiveSessions().then(setLiveSessions).catch(console.warn);
    const unsubscribe = liveService.subscribeToLiveSessions(setLiveSessions);
    return unsubscribe;
  }, []);

  // ── Load Orders ────────────────────────────────────────────
  const refreshOrders = useCallback(async () => {
    if (!userId) return;
    try {
      const data = role === 'seller'
        ? await orderService.getSellerOrders(userId)
        : await orderService.getBuyerOrders(userId);
      setOrders(data);
    } catch (e) {
      console.warn('Orders fetch failed:', e);
    }
  }, [userId, role]);

  useEffect(() => {
    if (userId) refreshOrders();
  }, [userId, role]);

  // ── Load Wishlist IDs ──────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setWishlistIds([]);
      return;
    }
    wishlistService.getWishlistProductIds(userId).then(setWishlistIds).catch(console.warn);
  }, [userId]);

  // ── Derived state ──────────────────────────────────────────
  const sellerProducts = useMemo(
    () => products.filter((p) => p.sellerId === userId),
    [products, userId]
  );

  const currentLiveProduct =
    products.find((p) => p.id === currentLiveProductId) ?? products[0];

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  // ── Actions ────────────────────────────────────────────────
  const switchRole = () => {
    setRole((cur) => (cur === 'buyer' ? 'seller' : 'buyer'));
  };

  const toggleTheme = () => {
    setThemeMode((cur) => (cur === 'light' ? 'dark' : 'light'));
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    setUserProfile((cur) => ({ ...cur, ...updates }));
    if (userId) {
      await authService.updateProfile(userId, {
        name: updates.name,
        avatar_url: updates.avatar,
        locality: updates.locality,
      });
    }
  };

  const addProduct = async (draft: ProductDraft) => {
    if (!userId) return;
    const newProduct = await productService.addProduct(
      userId,
      userProfile.name,
      userProfile.sellerRating,
      userProfile.locality,
      draft
    );
    setProducts((cur) => [newProduct, ...cur]);
  };

  const updateProduct = async (productId: string, draft: ProductDraft) => {
    if (!userId) return;
    const updated = await productService.updateProduct(productId, userId, draft);
    setProducts((cur) => cur.map((p) => (p.id === productId ? updated : p)));
  };

  const deleteProduct = async (productId: string) => {
    if (!userId) return;
    await productService.deleteProduct(productId, userId);
    setProducts((cur) => cur.filter((p) => p.id !== productId));
    if (currentLiveProductId === productId) {
      setCurrentLiveProductId(products[0]?.id ?? '');
      setLiveUpdatePulseKey((cur) => cur + 1);
    }
  };

  const setCurrentLiveProductById = (productId: string) => {
    setCurrentLiveProductId(productId);
    setLiveUpdatePulseKey((cur) => cur + 1);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
    setOrders((cur) =>
      cur.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const toggleWishlist = async (productId: string) => {
    if (!userId) return;
    const added = await wishlistService.toggleWishlist(userId, productId);
    setWishlistIds((cur) =>
      added ? [...cur, productId] : cur.filter((id) => id !== productId)
    );
  };

  const placeOrder = async (
    productId: string,
    method: CheckoutMethod,
    quantity: number
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !userId) return;

    const newOrder = await orderService.placeOrder({
      productId: product.id,
      productName: product.name,
      buyerId: userId,
      buyerName: userProfile.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      quantity,
      price: product.price * quantity,
      deliveryMethod: method,
    });
    setOrders((cur) => [newOrder, ...cur]);
  };

  const value = useMemo<AppContextValue>(
    () => ({
      userId,
      isLoggedIn: !!userId,
      isLoading,
      role,
      setRole,
      switchRole,
      themeMode,
      toggleTheme,
      userProfile,
      updateUserProfile,
      products,
      sellerProducts,
      refreshProducts,
      chats: [],
      orders,
      refreshOrders,
      reviews: [],
      liveSessions,
      currentLiveProduct,
      liveUpdatePulseKey,
      selectedProduct,
      selectedOrder,
      selectedChat,
      wishlistProducts,
      setSelectedProduct,
      setSelectedOrder,
      setSelectedChat,
      addProduct,
      updateProduct,
      deleteProduct,
      setCurrentLiveProductById,
      updateOrderStatus,
      toggleWishlist,
      placeOrder,
    }),
    [
      userId,
      isLoading,
      role,
      themeMode,
      userProfile,
      products,
      sellerProducts,
      orders,
      liveSessions,
      currentLiveProduct,
      liveUpdatePulseKey,
      selectedProduct,
      selectedOrder,
      selectedChat,
      wishlistProducts,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
