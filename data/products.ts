export type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  distance: string;
  locality: string;
  rating: number;
  image: string;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
};

export const products: Product[] = [
  {
    id: "p1",
    sellerId: "seller-6",
    sellerName: "Craft Roots",
    sellerRating: 4.9,
    name: "Handmade Bamboo Basket",
    shortDescription: "Natural woven basket for home storage",
    description:
      "Durable bamboo basket handmade by local artisans. Great for fruit, storage, or gifting.",
    category: "Handicrafts",
    price: 260,
    distance: "2.4 km away",
    locality: "JP Nagar",
    rating: 4.8,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p2",
    sellerId: "seller-1",
    sellerName: "Kavya Sharma",
    sellerRating: 4.8,
    name: "Homemade Pickles",
    shortDescription: "Spicy and tangy traditional recipe",
    description:
      "Prepared in small batches with mustard oil and farm spices. No preservatives.",
    category: "Homemade",
    price: 80,
    distance: "1.5 km away",
    locality: "HSR Layout",
    rating: 4.9,
    image: "https://via.placeholder.com/220",
    stockStatus: "low-stock",
  },
  {
    id: "p3",
    sellerId: "seller-2",
    sellerName: "Harit Farms",
    sellerRating: 4.6,
    name: "Organic Banana Bunch",
    shortDescription: "Pesticide-free local bananas",
    description:
      "Naturally grown bananas with balanced sweetness. Great for breakfast and smoothies.",
    category: "Fruits",
    price: 60,
    distance: "3.2 km away",
    locality: "Koramangala",
    rating: 4.5,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p4",
    sellerId: "seller-2",
    sellerName: "Harit Farms",
    sellerRating: 4.6,
    name: "Village Farm Eggs",
    shortDescription: "Free-range farm eggs",
    description:
      "High-protein eggs from free-range hens, delivered same day in eco packaging.",
    category: "Dairy",
    price: 120,
    distance: "900 m away",
    locality: "Koramangala",
    rating: 4.8,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p5",
    sellerId: "seller-3",
    sellerName: "Roots Naturals",
    sellerRating: 4.7,
    name: "A2 Cow Ghee",
    shortDescription: "Traditional bilona-style ghee",
    description:
      "Slow-cooked in small batches for rich aroma and taste. Ideal for daily meals.",
    category: "Dairy",
    price: 420,
    distance: "2.8 km away",
    locality: "Indiranagar",
    rating: 4.6,
    image: "https://via.placeholder.com/220",
    stockStatus: "low-stock",
  },
  {
    id: "p6",
    sellerId: "seller-4",
    sellerName: "Bake & Roots",
    sellerRating: 4.5,
    name: "Handmade Millet Cookies",
    shortDescription: "Jaggery-sweetened healthy cookies",
    description:
      "Baked fresh every morning with ragi and jaggery. A guilt-free tea-time snack.",
    category: "Snacks",
    price: 140,
    distance: "2.1 km away",
    locality: "BTM Layout",
    rating: 4.4,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p7",
    sellerId: "seller-1",
    sellerName: "Kavya Sharma",
    sellerRating: 4.8,
    name: "Fresh Coriander Bundle",
    shortDescription: "Freshly harvested and washed",
    description:
      "Coriander bunches packed daily from local farms. Best for chutneys and garnish.",
    category: "Vegetables",
    price: 35,
    distance: "1.2 km away",
    locality: "HSR Layout",
    rating: 4.3,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p8",
    sellerId: "seller-5",
    sellerName: "Green Basket",
    sellerRating: 4.4,
    name: "Tomato Crate",
    shortDescription: "Farm fresh medium-ripe tomatoes",
    description:
      "A value pack suitable for households and small kitchens. Sourced from nearby growers.",
    category: "Vegetables",
    price: 75,
    distance: "3 km away",
    locality: "Jayanagar",
    rating: 4.2,
    image: "https://via.placeholder.com/220",
    stockStatus: "out-of-stock",
  },
  {
    id: "p9",
    sellerId: "seller-1",
    sellerName: "Kavya Sharma",
    sellerRating: 4.8,
    name: "Fresh Mango Box",
    shortDescription: "Naturally ripened Alphonso mangoes",
    description:
      "Hand-picked seasonal mangoes from a nearby farm. Perfect for juices, desserts, or fresh snacking.",
    category: "Fruits",
    price: 100,
    distance: "2 km away",
    locality: "HSR Layout",
    rating: 4.7,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p10",
    sellerId: "seller-6",
    sellerName: "Craft Roots",
    sellerRating: 4.9,
    name: "Jute Tote Bag",
    shortDescription: "Eco-friendly daily carry bag",
    description:
      "Stylish jute tote bag with sturdy handles. Ideal for shopping, office, or casual use.",
    category: "Handicrafts",
    price: 180,
    distance: "2.4 km away",
    locality: "JP Nagar",
    rating: 4.7,
    image: "https://via.placeholder.com/220",
    stockStatus: "in-stock",
  },
  {
    id: "p11",
    sellerId: "seller-6",
    sellerName: "Craft Roots",
    sellerRating: 4.9,
    name: "Jute Planter Pot Cover",
    shortDescription: "Rustic plant decor accessory",
    description:
      "A handmade jute cover that adds rustic charm to indoor plants and decorative corners.",
    category: "Handicrafts",
    price: 120,
    distance: "2.4 km away",
    locality: "JP Nagar",
    rating: 4.6,
    image: "https://via.placeholder.com/220",
    stockStatus: "low-stock",
  },
];
