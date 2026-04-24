export type ChatPreview = {
  id: string;
  personName: string;
  personRole: "buyer" | "seller";
  lastMessage: string;
  time: string;
  unreadCount: number;
};

export const chatPreviews: ChatPreview[] = [
  {
    id: "c1",
    personName: "Kavya (Seller)",
    personRole: "seller",
    lastMessage: "Fresh stock just arrived. Want 2 boxes?",
    time: "10:42 AM",
    unreadCount: 2,
  },
  {
    id: "c2",
    personName: "Rohan (Buyer)",
    personRole: "buyer",
    lastMessage: "Please mark my order as shipped.",
    time: "09:18 AM",
    unreadCount: 0,
  },
  {
    id: "c3",
    personName: "Neha (Buyer)",
    personRole: "buyer",
    lastMessage: "Can you add millet flour in next live?",
    time: "Yesterday",
    unreadCount: 1,
  },
  {
    id: "c4",
    personName: "Farm Circle Group",
    personRole: "seller",
    lastMessage: "Tonight's live topic: Weekly organic basket",
    time: "Yesterday",
    unreadCount: 0,
  },
];
