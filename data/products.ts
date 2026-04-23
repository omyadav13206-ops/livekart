export type Product = {
  id: string;
  name: string;
  price: number;
  distance: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Fresh Mango Box",
    price: 100,
    distance: "2 km away",
    image: "https://source.unsplash.com/1600x900/?mango",
  },
  {
    id: "2",
    name: "Homemade Pickles",
    price: 80,
    distance: "1.5 km away",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Organic Banana Bunch",
    price: 60,
    distance: "3.2 km away",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    name: "Village Farm Eggs",
    price: 120,
    distance: "900 m away",
    image: "https://via.placeholder.com/150",
  },
];
