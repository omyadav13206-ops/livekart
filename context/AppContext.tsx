import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import { chatPreviews, type ChatPreview } from "../data/chats";
import { liveSessions } from "../data/liveSessions";
import { mockOrders, type OrderItem, type OrderStatus } from "../data/orders";
import { products as seedProducts, type Product } from "../data/products";
import { reviews, type Review } from "../data/reviews";
import { mockUserProfile, type UserProfile } from "../data/userProfile";
import type { AppThemeMode, Role } from "../navigation/types";

type ProductDraft = {
  name: string;
  price: number;
  description: string;
  category: string;
  shortDescription?: string;
};

type CheckoutMethod = "delivery" | "pickup";

type AppContextValue = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  switchRole: () => void;
  themeMode: AppThemeMode;
  toggleTheme: () => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  products: Product[];
  sellerProducts: Product[];
  chats: ChatPreview[];
  orders: OrderItem[];
  reviews: Review[];
  liveSessions: typeof liveSessions;
  currentLiveProduct: Product;
  liveUpdatePulseKey: number;
  selectedProduct: Product | null;
  selectedOrder: OrderItem | null;
  selectedChat: ChatPreview | null;
  wishlistProducts: Product[];
  setSelectedProduct: (product: Product | null) => void;
  setSelectedOrder: (order: OrderItem | null) => void;
  setSelectedChat: (chat: ChatPreview | null) => void;
  addProduct: (draft: ProductDraft) => void;
  updateProduct: (productId: string, draft: ProductDraft) => void;
  deleteProduct: (productId: string) => void;
  setCurrentLiveProductById: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (
    productId: string,
    method: CheckoutMethod,
    quantity: number,
  ) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<Role | null>(null);
  const [themeMode, setThemeMode] = useState<AppThemeMode>("light");
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [currentLiveProductId, setCurrentLiveProductId] = useState<string>(
    seedProducts[0]?.id,
  );
  const [liveUpdatePulseKey, setLiveUpdatePulseKey] = useState(0);

  const sellerProducts = useMemo(
    () => products.filter((product) => product.sellerId === userProfile.id),
    [products, userProfile.id],
  );

  const currentLiveProduct =
    products.find((product) => product.id === currentLiveProductId) ??
    products[0];

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistIds.includes(product.id)),
    [products, wishlistIds],
  );

  const switchRole = () => {
    setRole((current) => (current === "buyer" ? "seller" : "buyer"));
  };

  const toggleTheme = () => {
    setThemeMode((current) => (current === "light" ? "dark" : "light"));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((current) => ({ ...current, ...updates }));
  };

  const addProduct = (draft: ProductDraft) => {
    const id = `p-${Date.now()}`;
    const nextProduct: Product = {
      id,
      sellerId: userProfile.id,
      sellerName: userProfile.name,
      sellerRating: userProfile.sellerRating,
      name: draft.name,
      shortDescription:
        draft.shortDescription ?? draft.description.slice(0, 55),
      description: draft.description,
      category: draft.category,
      price: draft.price,
      distance: "1.8 km away",
      locality: userProfile.locality,
      rating: 4.5,
      image: "https://via.placeholder.com/220",
      stockStatus: "in-stock",
    };

    setProducts((current) => [nextProduct, ...current]);
  };

  const updateProduct = (productId: string, draft: ProductDraft) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              name: draft.name,
              shortDescription:
                draft.shortDescription ?? draft.description.slice(0, 55),
              description: draft.description,
              category: draft.category,
              price: draft.price,
            }
          : product,
      ),
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((current) =>
      current.filter((product) => product.id !== productId),
    );

    if (currentLiveProductId === productId) {
      setCurrentLiveProductId(seedProducts[0]?.id);
      setLiveUpdatePulseKey((current) => current + 1);
    }
  };

  const setCurrentLiveProductById = (productId: string) => {
    setCurrentLiveProductId(productId);
    setLiveUpdatePulseKey((current) => current + 1);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
  };

  const placeOrder = (
    productId: string,
    method: CheckoutMethod,
    quantity: number,
  ) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const newOrder: OrderItem = {
      id: `o-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity,
      date: new Date().toISOString().slice(0, 10),
      price: product.price * quantity,
      sellerName: product.sellerName,
      buyerName: userProfile.name,
      deliveryMethod: method,
      status: method === "pickup" ? "pending" : "shipped",
    };

    setOrders((current) => [newOrder, ...current]);
  };

  const value = useMemo<AppContextValue>(
    () => ({
      role,
      setRole,
      switchRole,
      themeMode,
      toggleTheme,
      userProfile,
      updateUserProfile,
      products,
      sellerProducts,
      chats: chatPreviews,
      orders,
      reviews,
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
      role,
      themeMode,
      userProfile,
      products,
      sellerProducts,
      orders,
      currentLiveProduct,
      liveUpdatePulseKey,
      selectedProduct,
      selectedOrder,
      selectedChat,
      wishlistProducts,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
