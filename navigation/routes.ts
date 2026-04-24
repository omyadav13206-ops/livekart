export const AppRoutes = {
  tabsHome: "/",
  tabsCommunity: "/community",
  tabsOrders: "/orders",
  wishlist: "/wishlist",
  profile: "/profile",
  productDetails: (productId: string): `/product/${string}` =>
    `/product/${productId}`,
  buyerLive: "/live",
  sellerLive: "/seller-live",
  addProduct: "/add-product",
  editProduct: (productId: string): `/edit-product/${string}` =>
    `/edit-product/${productId}`,
  analytics: "/analytics",
} as const;
