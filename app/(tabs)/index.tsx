import { useCallback, useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { ProductCard, ProductCardSkeleton } from "../../components/ProductCard";
import { products } from "../../data/products";

export default function FeedScreen() {
  const [joinedDeals, setJoinedDeals] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const joinedCount = useMemo(() => joinedDeals.length, [joinedDeals]);

  const feedItems = useMemo(
    () =>
      refreshing
        ? Array.from({ length: 4 }, (_, index) => `skeleton-${index}`)
        : products,
    [refreshing],
  );

  const handleJoinDeal = (productId: string) => {
    setJoinedDeals((current) =>
      current.includes(productId) ? current : [...current, productId],
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Nearby Deals</Text>
        <Text style={styles.subHeading}>Joined: {joinedCount}</Text>
      </View>
      <FlatList
        data={feedItems}
        keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) =>
          typeof item === "string" ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard
              product={item}
              onJoinDeal={() => handleJoinDeal(item.id)}
              joined={joinedDeals.includes(item.id)}
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
    backgroundColor: "#f4f6f8",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#102027",
  },
  subHeading: {
    marginTop: 4,
    fontSize: 14,
    color: "#607d8b",
  },
  listContent: {
    padding: 18,
    paddingTop: 12,
    gap: 14,
  },
});
