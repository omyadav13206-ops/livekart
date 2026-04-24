export type LiveSession = {
  id: string;
  hostName: string;
  title: string;
  viewers: number;
  coverImage: string;
  locality: string;
};

export const liveSessions: LiveSession[] = [
  {
    id: "l1",
    hostName: "Kavya Sharma",
    title: "Seasonal Fruits Flash Deals",
    viewers: 112,
    coverImage: "https://via.placeholder.com/400x240",
    locality: "MG Road",
  },
  {
    id: "l2",
    hostName: "Harit Farms",
    title: "Eggs and Dairy Morning Live",
    viewers: 87,
    coverImage: "https://via.placeholder.com/400x240",
    locality: "Koramangala",
  },
  {
    id: "l3",
    hostName: "Bake & Roots",
    title: "Healthy Snacks Hour",
    viewers: 63,
    coverImage: "https://via.placeholder.com/400x240",
    locality: "Indiranagar",
  },
];
