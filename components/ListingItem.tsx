import { StyleSheet, Text, View } from "react-native";

type ListingItemProps = {
  title: string;
  price: number;
  status: string;
};

export function ListingItem({ title, price, status }: ListingItemProps) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>Rs. {price}</Text>
      </View>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
    color: "#1f2933",
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    color: "#26a69a",
    fontWeight: "700",
  },
  status: {
    color: "#455a64",
    fontSize: 13,
    backgroundColor: "#eceff1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: "hidden",
  },
});
