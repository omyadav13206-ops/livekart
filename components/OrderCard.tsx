import { Pressable, StyleSheet, Text, View } from "react-native";

import type { OrderItem, OrderStatus } from "../data/orders";
import { PrimaryButton } from "./PrimaryButton";

type OrderCardProps = {
  order: OrderItem;
  onPress?: () => void;
  sellerActions?: boolean;
  onStatusChange?: (status: OrderStatus) => void;
};

const statusColor: Record<OrderStatus, string> = {
  pending: "#ef6c00",
  shipped: "#1565c0",
  delivered: "#1f8f57",
  "picked-up": "#2e7d32",
  cancelled: "#b71c1c",
};

export function OrderCard({
  order,
  onPress,
  sellerActions = false,
  onStatusChange,
}: OrderCardProps) {
  const deliveryStatusText =
    order.status === "pending"
      ? order.deliveryMethod === "pickup"
        ? "Pickup status: ready for pickup"
        : "Delivery status: waiting for confirmation"
      : order.status === "shipped"
        ? "Delivery status: shipped"
        : order.status === "picked-up"
          ? "Pickup status: picked up"
          : order.status === "delivered"
            ? "Delivery status: delivered"
            : "Order cancelled";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.name}>{order.productName}</Text>
        <Text style={[styles.status, { color: statusColor[order.status] }]}>
          {order.status}
        </Text>
      </View>
      <Text style={styles.meta}>Seller: {order.sellerName}</Text>
      <Text style={styles.meta}>Buyer: {order.buyerName}</Text>
      <Text style={styles.meta}>Qty: {order.quantity}</Text>
      <Text style={styles.meta}>Method: {order.deliveryMethod}</Text>
      <Text style={styles.meta}>Date: {order.date}</Text>
      <Text style={styles.price}>Rs. {order.price}</Text>
      <Text style={styles.deliveryText}>{deliveryStatusText}</Text>

      {sellerActions ? (
        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <PrimaryButton
              label="Mark Shipped"
              onPress={() => onStatusChange?.("shipped")}
              variant="ghost"
            />
          </View>
          <View style={styles.actionItem}>
            <PrimaryButton
              label="Mark Delivered"
              onPress={() =>
                onStatusChange?.(
                  order.deliveryMethod === "pickup" ? "picked-up" : "delivered",
                )
              }
            />
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dbe8df",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#11291f",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  status: {
    textTransform: "capitalize",
    fontWeight: "700",
    fontSize: 12,
  },
  meta: {
    marginTop: 4,
    color: "#4e5f54",
    fontSize: 13,
  },
  price: {
    marginTop: 8,
    fontWeight: "800",
    color: "#1f8f57",
    fontSize: 15,
  },
  deliveryText: {
    marginTop: 6,
    color: "#5a6c61",
    fontSize: 12,
    fontWeight: "500",
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  actionItem: {
    flex: 1,
  },
});
