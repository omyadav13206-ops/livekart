import { Pressable, StyleSheet, Text, View } from "react-native";

type LiveOverlayProps = {
  productName: string;
  price: number;
};

export function LiveOverlay({ productName, price }: LiveOverlayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Featured Deal</Text>
      <Text style={styles.productName}>{productName}</Text>
      <Text style={styles.price}>Rs. {price}</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(12, 32, 44, 0.92)",
    borderRadius: 16,
    padding: 14,
  },
  label: {
    color: "#90caf9",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  productName: {
    marginTop: 4,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  price: {
    marginTop: 2,
    color: "#80cbc4",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#ff7043",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
