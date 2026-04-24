import { useEffect, useRef } from "react";
import {
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";

const chatMessages = [
  "Asha: This looks fresh!",
  "Rohan: Price seems great for today.",
  "Meera: Added to cart already.",
  "Vikram: Do we get same-day delivery?",
];

export default function BuyerLiveScreen() {
  const { currentLiveProduct, liveUpdatePulseKey } = useAppContext();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pulse.setValue(0.92);
    Animated.spring(pulse, {
      toValue: 1,
      friction: 5,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [liveUpdatePulseKey, pulse]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Live Session"
          subtitle="Product updates follow seller changes"
        />

        <View style={styles.videoFrame}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          <Text style={styles.placeholder}>Live Video Placeholder</Text>

          <Animated.View
            style={[styles.overlay, { transform: [{ scale: pulse }] }]}
          >
            <Text style={styles.productName}>{currentLiveProduct.name}</Text>
            <Text style={styles.productPrice}>
              Rs. {currentLiveProduct.price}
            </Text>
            <PrimaryButton label="Buy Now" onPress={() => {}} />
          </Animated.View>
        </View>

        <SectionHeader title="Chat" subtitle="Mock live conversation" />
        {chatMessages.map((message) => (
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
    height: 300,
    borderRadius: 18,
    backgroundColor: "#111f17",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#d62828",
  },
  liveBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  placeholder: {
    color: "#b7cbbe",
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 14,
    backgroundColor: "rgba(17, 48, 33, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(167, 213, 185, 0.25)",
    padding: 12,
  },
  productName: {
    color: "#f1fff7",
    fontSize: 16,
    fontWeight: "700",
  },
  productPrice: {
    marginVertical: 6,
    color: "#b2f0ca",
    fontWeight: "800",
    fontSize: 16,
  },
  chatBubble: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dce8e0",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 6,
  },
  chatText: {
    color: "#4d6257",
    fontSize: 13,
  },
});
