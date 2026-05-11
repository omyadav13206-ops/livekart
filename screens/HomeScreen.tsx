import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { AppTopBar } from "../components/AppTopBar";
import { LiveCard } from "../components/LiveCard";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";
import { AppRoutes } from "../navigation/routes";

const quickActionItems = [
  {
    id: "add",
    title: "Add Product",
    icon: "add-box" as const,
    route: AppRoutes.addProduct,
  },
  {
    id: "live",
    title: "Start Live",
    icon: "live-tv" as const,
    route: AppRoutes.sellerLive,
  },
  {
    id: "orders",
    title: "View Orders",
    icon: "receipt-long" as const,
    route: AppRoutes.tabsOrders,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: "query-stats" as const,
    route: AppRoutes.analytics,
  },
];

export default function HomeScreen() {
  const {
    role,
    products,
    sellerProducts,
    liveSessions,
    setSelectedProduct,
    setSelectedOrder,
    setSelectedChat,
  } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredBuyerProducts = useMemo(() => {
    if (!searchText.trim()) {
      return products;
    }

    const normalized = searchText.toLowerCase();
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized) ||
        item.locality.toLowerCase().includes(normalized),
    );
  }, [products, searchText]);

  const feedItems = useMemo(
    () =>
      refreshing
        ? Array.from({ length: 3 }, (_, index) => `skeleton-${index}`)
        : filteredBuyerProducts,
    [refreshing, filteredBuyerProducts],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRefreshing(false);
  }, []);

  const openProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setSelectedProduct(product);
    setSelectedOrder(null);
    setSelectedChat(null);
    router.push(AppRoutes.productDetails(product.id));
  };

  if (role === "seller") {
    const totalSales = 124560;
    const ordersToday = 14;
    const activeListings = sellerProducts.filter(
      (item) => item.stockStatus !== "out-of-stock",
    ).length;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <AppTopBar
            title="Seller Dashboard"
            subtitle="Welcome back, Seller"
            onProfilePress={() => router.push(AppRoutes.profile)}
          />

          <SectionHeader
            title="Quick Actions"
            subtitle="Run your business from one place"
          />
          <View style={styles.quickActionsRow}>
            {quickActionItems.map((item) => (
              <Pressable
                key={item.id}
                style={styles.quickActionCard}
                onPress={() => router.push(item.route)}
              >
                <MaterialIcons name={item.icon} size={22} color="#1f8f57" />
                <Text style={styles.quickActionText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>

          <SectionHeader
            title="Seller Stats"
            subtitle="Mock performance snapshot"
          />
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Sales</Text>
              <Text style={styles.statValue}>Rs. {totalSales}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Orders Today</Text>
              <Text style={styles.statValue}>{ordersToday}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Active Listings</Text>
              <Text style={styles.statValue}>{activeListings}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>4.8</Text>
            </View>
          </View>

          <SectionHeader
            title="My Listings"
            subtitle="Tap any listing to edit"
          />
          {sellerProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              mode="seller"
              onPress={() => router.push(AppRoutes.editProduct(item.id))}
              onPrimaryPress={() => router.push(AppRoutes.editProduct(item.id))}
              primaryLabel="Edit"
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={feedItems}
        keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            <AppTopBar
              title="                  Local Baazar"
              subtitle="                    Fresh social commerce around you"
              onProfilePress={() => router.push(AppRoutes.profile)}
            />

            <SectionHeader
              title="🔴 Live Sessions"
              subtitle="Real-time live streaming by sellers"
            />

            {/* Always-visible Join Live button */}
            <Pressable
              style={styles.joinLiveBtn}
              onPress={() => router.push(AppRoutes.buyerLive)}
            >
              <MaterialIcons name="live-tv" size={22} color="#fff" />
              <Text style={styles.joinLiveBtnText}>Join Live Stream Now</Text>
              <MaterialIcons name="arrow-forward-ios" size={14} color="#fff" />
            </Pressable>

            {liveSessions.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalList}
              >
                {liveSessions.map((session) => (
                  <LiveCard
                    key={session.id}
                    session={session}
                    onPress={() => router.push(AppRoutes.buyerLive)}
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={20} color="#719181" />
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search products, category, locality"
                placeholderTextColor="#7d9185"
              />
            </View>

            <SectionHeader
              title="Popular Near You"
              subtitle="Browse curated local deals"
            />
          </>
        }
        renderItem={({ item }) =>
          typeof item === "string" ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard
              product={item}
              onPress={() => openProduct(item.id)}
              onPrimaryPress={() => openProduct(item.id)}
              primaryLabel="View Details"
            />
          )
        }
      />
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
  horizontalList: {
    marginBottom: 14,
  },
  joinLiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#d62828",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  joinLiveBtnText: {
    flex: 1,
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  searchBox: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d7e7dd",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#1b3528",
    fontSize: 14,
  },
  quickActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dce8e0",
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickActionText: {
    color: "#183326",
    fontWeight: "700",
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
  },
  statLabel: {
    color: "#66796e",
    fontSize: 12,
  },
  statValue: {
    marginTop: 6,
    color: "#173324",
    fontWeight: "800",
    fontSize: 18,
  },
});
