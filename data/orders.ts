export type OrderStatus =
  | "pending"
  | "shipped"
  | "delivered"
  | "picked-up"
  | "cancelled";

export type DeliveryMethod = "delivery" | "pickup";

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  price: number;
  sellerName: string;
  buyerName: string;
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
};

export const mockOrders: OrderItem[] = [
  {
    id: "o1",
    productId: "p1",
    productName: "Fresh Mango Box",
    quantity: 1,
    date: "2026-04-22",
    price: 100,
    sellerName: "Kavya Sharma",
    buyerName: "Aman Verma",
    deliveryMethod: "delivery",
    status: "pending",
  },
  {
    id: "o2",
    productId: "p2",
    productName: "Homemade Pickles",
    quantity: 1,
    date: "2026-04-20",
    price: 80,
    sellerName: "Kavya Sharma",
    buyerName: "Priya Das",
    deliveryMethod: "delivery",
    status: "shipped",
  },
  {
    id: "o3",
    productId: "p4",
    productName: "Village Farm Eggs",
    quantity: 2,
    date: "2026-04-18",
    price: 240,
    sellerName: "Harit Farms",
    buyerName: "Aman Verma",
    deliveryMethod: "delivery",
    status: "delivered",
  },
  {
    id: "o4",
    productId: "p6",
    productName: "Handmade Millet Cookies",
    quantity: 1,
    date: "2026-04-16",
    price: 140,
    sellerName: "Bake & Roots",
    buyerName: "Aman Verma",
    deliveryMethod: "pickup",
    status: "picked-up",
  },
  {
    id: "o5",
    productId: "p7",
    productName: "Fresh Coriander Bundle",
    quantity: 1,
    date: "2026-04-23",
    price: 35,
    sellerName: "Kavya Sharma",
    buyerName: "Nupur Singh",
    deliveryMethod: "delivery",
    status: "cancelled",
  },
];
