import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";

export default function WishlistScreen() {
  const { wishlistProducts } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.headerBlock}>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>Saved items</Text>
        </View> */}

        <SectionHeader title="Wishlist Items" />
        {wishlistProducts.length > 0 ? (
          wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(AppRoutes.productDetails(product.id))}
              onPrimaryPress={() =>
                router.push(AppRoutes.productDetails(product.id))
              }
              primaryLabel="View Details"
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No wishlist items yet.</Text>
          </View>
        )}
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
  headerBlock: {
    marginBottom: 14,
  },
  title: {
    color: "#0e271a",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 3,
    color: "#5f7065",
    fontSize: 13,
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe8df",
    backgroundColor: "#ffffff",
    padding: 14,
  },
  emptyText: {
    color: "#5a6b61",
    fontSize: 13,
  },
});
