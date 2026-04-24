export type Review = {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    reviewerName: "Anita",
    rating: 5,
    comment: "Very fresh mangoes and quick delivery.",
    createdAt: "2026-04-18",
  },
  {
    id: "r2",
    productId: "p1",
    reviewerName: "Ravi",
    rating: 4,
    comment: "Good quality, packaging could be better.",
    createdAt: "2026-04-20",
  },
  {
    id: "r3",
    productId: "p2",
    reviewerName: "Meera",
    rating: 5,
    comment: "Exactly like home-style pickles. Loved it.",
    createdAt: "2026-04-17",
  },
  {
    id: "r4",
    productId: "p3",
    reviewerName: "Sahil",
    rating: 4,
    comment: "Good bananas for the price.",
    createdAt: "2026-04-15",
  },
  {
    id: "r5",
    productId: "p4",
    reviewerName: "Nisha",
    rating: 5,
    comment: "Eggs were fresh and clean.",
    createdAt: "2026-04-19",
  },
  {
    id: "r6",
    productId: "p5",
    reviewerName: "Dev",
    rating: 4,
    comment: "Authentic ghee aroma. Will buy again.",
    createdAt: "2026-04-16",
  },
];
