import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";

const liveChat = [
  "Aman: Is this available in bulk?",
  "Neha: Please show packaging quality.",
  "Ravi: Can you bundle with pickles?",
  "Priya: What's the delivery ETA?",
];

export default function SellerLiveScreen() {
  const { sellerProducts, currentLiveProduct, setCurrentLiveProductById } =
    useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Seller Live"
          subtitle="UI simulation for live selling"
        />

        <View style={styles.videoFrame}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          <Text style={styles.videoPlaceholder}>
            Seller Camera Stream Placeholder
          </Text>
          <Text style={styles.viewerCount}>128 viewers watching</Text>
        </View>

        <SectionHeader
          title="Current Product On Live"
          subtitle="Buyer live updates from this state"
        />
        <View style={styles.currentProductCard}>
          <Text style={styles.currentName}>{currentLiveProduct.name}</Text>
          <Text style={styles.currentPrice}>
            Rs. {currentLiveProduct.price}
          </Text>
        </View>

        <SectionHeader
          title="Show This Product"
          subtitle="Switch product in live overlay"
        />
        {sellerProducts.map((product) => (
          <View key={product.id} style={styles.productRow}>
            <View style={styles.productMeta}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>Rs. {product.price}</Text>
            </View>
            <PrimaryButton
              label="Show"
              onPress={() => setCurrentLiveProductById(product.id)}
            />
          </View>
        ))}

        <PrimaryButton label="End Live" variant="ghost" onPress={() => {}} />

        <SectionHeader title="Live Chat (Read only)" />
        {liveChat.map((message) => (
          <View key={message} style={styles.chatBubble}>
            <Text style={styles.chatText}>{message}</Text>
          </View>
        ))}
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
    paddingBottom: 22,
  },
  videoFrame: {
    height: 230,
    backgroundColor: "#101b15",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    position: "relative",
  },
  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#d62828",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  videoPlaceholder: {
    color: "#c5d7cd",
    fontWeight: "600",
  },
  viewerCount: {
    marginTop: 6,
    color: "#93ad9f",
    fontSize: 12,
  },
  currentProductCard: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 12,
  },
  currentName: {
    color: "#123223",
    fontWeight: "700",
    fontSize: 15,
  },
  currentPrice: {
    marginTop: 4,
    color: "#1f8f57",
    fontWeight: "800",
    fontSize: 16,
  },
  productRow: {
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productMeta: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    color: "#173126",
    fontWeight: "700",
  },
  productPrice: {
    marginTop: 3,
    color: "#5d7065",
    fontSize: 12,
  },
  chatBubble: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 10,
    marginBottom: 6,
  },
  chatText: {
    color: "#4d6255",
    fontSize: 13,
  },
});
