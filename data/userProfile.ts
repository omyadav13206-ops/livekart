export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  sellerRating: number;
  buyerRating: number;
  locality: string;
  joinedSince: string;
};

export const mockUserProfile: UserProfile = {
  id: "seller-1",
  name: "Kush Deshmukh",
  avatar: "https://via.placeholder.com/120",
  sellerRating: 4.8,
  buyerRating: 4.7,
  locality: "Anand Nagar",
  joinedSince: "2024",
};
