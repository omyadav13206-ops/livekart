import { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { LiveOverlay } from "../../components/LiveOverlay";
import { products } from "../../data/products";

const chatMessages = [
  "Asha: This looks super fresh!",
  "Rohan: Is there home delivery?",
  "Neha: Just ordered one box!",
  "Vikram: Great price for today.",
];

export default function LiveScreen() {
  const [viewerCount] = useState(128);
  const featuredProduct = products[0];

  const title = useMemo(
    () => `Live Bazaar Session • ${viewerCount} watching`,
    [viewerCount],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Live</Text>
        <Text style={styles.subHeading}>{title}</Text>

        <View style={styles.videoFrame}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          <Text style={styles.videoPlaceholder}>Video Stream Placeholder</Text>

          <View style={styles.overlayContainer}>
            <LiveOverlay
              productName={featuredProduct.name}
              price={featuredProduct.price}
            />
          </View>
        </View>

        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>Live Chat</Text>
          {chatMessages.map((message) => (
            <View key={message} style={styles.chatMessage}>
              <Text style={styles.chatMessageText}>{message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  content: {
    padding: 18,
    gap: 16,
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
  videoFrame: {
    marginTop: 14,
    backgroundColor: "#111827",
    borderRadius: 20,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  liveBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveBadgeText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  videoPlaceholder: {
    color: "#90a4ae",
    fontSize: 16,
    fontWeight: "600",
  },
  overlayContainer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    gap: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 4,
  },
  chatMessage: {
    backgroundColor: "#eef3f8",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  chatMessageText: {
    color: "#37474f",
    fontSize: 14,
  },
});
