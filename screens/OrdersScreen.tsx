import { router } from "expo-router";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { AppTopBar } from "../components/AppTopBar";
import { OrderCard } from "../components/OrderCard";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";
import { AppRoutes } from "../navigation/routes";

export default function OrdersScreen() {
  const {
    role,
    orders,
    updateOrderStatus,
    setSelectedOrder,
    userProfile,
    wishlistProducts,
  } = useAppContext();

  const visibleOrders =
    role === "seller"
      ? orders.filter((order) => order.sellerName === userProfile.name)
      : orders.filter((order) => order.buyerName === userProfile.name);

  const orderHistory = visibleOrders.length > 0 ? visibleOrders : orders;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppTopBar
          title={role === "seller" ? "Orders Received" : "My Orders"}
          onProfilePress={() => router.push(AppRoutes.profile)}
        />
        <SectionHeader title="Wishlist" />
        <View style={styles.wishlistActionWrap}>
          <Pressable
            style={styles.wishlistButton}
            onPress={() => router.push(AppRoutes.wishlist)}
          >
            <Text style={styles.wishlistButtonText}>Open My Wishlist</Text>
            {wishlistProducts.length > 0 ? (
              <View style={styles.wishlistBadge}>
                <Text style={styles.wishlistBadgeText}>
                  {wishlistProducts.length}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <SectionHeader
          title="Order History"
          subtitle="All your local commerce orders"
        />
        {orderHistory.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            sellerActions={role === "seller"}
            onStatusChange={(status) => updateOrderStatus(order.id, status)}
            onPress={() => setSelectedOrder(order)}
          />
        ))}
        {orderHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No orders in history yet.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7f4",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  wishlistActionWrap: {
    marginBottom: 10,
  },
  wishlistButton: {
    borderRadius: 12,
    backgroundColor: "#e9f7ef",
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  wishlistButtonText: {
    color: "#16663f",
    fontSize: 14,
    fontWeight: "700",
  },
  wishlistBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1f8f57",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  wishlistBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe8df",
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 12,
  },
  emptyText: {
    color: "#5a6b61",
    fontSize: 13,
  },
});
