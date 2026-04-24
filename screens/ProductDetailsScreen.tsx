import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Animated,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { RatingStars } from "../components/RatingStars";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";

type CheckoutMethod = "delivery" | "pickup";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    products,
    reviews,
    setSelectedProduct,
    toggleWishlist,
    wishlistProducts,
    placeOrder,
  } = useAppContext();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] =
    useState<CheckoutMethod>("delivery");
  const [orderComplete, setOrderComplete] = useState(false);
  const [recentOrderMethod, setRecentOrderMethod] =
    useState<CheckoutMethod>("delivery");
  const [quantity, setQuantity] = useState(1);
  const successScale = useMemo(() => new Animated.Value(0.92), []);

  const product = products.find((item) => item.id === id);
  const productReviews = reviews.filter((item) => item.productId === id);
  const isWishlisted = wishlistProducts.some((item) => item.id === id);

  const animateSuccess = (method: CheckoutMethod) => {
    setCheckoutOpen(false);
    setRecentOrderMethod(method);
    setOrderComplete(true);
    successScale.setValue(0.92);
    Animated.spring(successScale, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setOrderComplete(false);
    }, 2200);
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onContinueCheckout = () => {
    placeOrder(product.id, selectedMethod, quantity);
    animateSuccess(selectedMethod);
  };

  const totalPrice = product.price * quantity;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: product.image }} style={styles.heroImage} />

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>Rs. {totalPrice}</Text>
        <Text style={styles.unitPrice}>Unit price: Rs. {product.price}</Text>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Quantity</Text>
          <View style={styles.qtyControls}>
            <Pressable
              style={styles.qtyButton}
              onPress={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              style={styles.qtyButton}
              onPress={() => setQuantity((current) => current + 1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.metaBlock}>
          <Text style={styles.meta}>Seller: {product.sellerName}</Text>
          <Text style={styles.meta}>
            Seller rating: {product.sellerRating.toFixed(1)}
          </Text>
          <Text style={styles.meta}>Locality: {product.locality}</Text>
          <Text style={styles.meta}>Distance: {product.distance}</Text>
        </View>

        <SectionHeader
          title="Reviews"
          subtitle="Average rating"
          rightText={product.rating.toFixed(1)}
        />
        <RatingStars rating={product.rating} />

        {productReviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Text style={styles.reviewName}>{review.reviewerName}</Text>
            <RatingStars rating={review.rating} showLabel={false} />
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}

        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <PrimaryButton
              label="Order Now"
              onPress={() => setCheckoutOpen(true)}
            />
          </View>
          <View style={styles.actionItem}>
            <PrimaryButton
              label="Chat with Seller"
              onPress={() => router.push("/community")}
              variant="ghost"
            />
          </View>
        </View>
        <Pressable
          style={styles.wishlistButton}
          onPress={() => {
            toggleWishlist(product.id);
            setSelectedProduct(product);
          }}
        >
          <Text style={styles.wishlistButtonText}>
            {isWishlisted ? "Saved" : "Save to Wishlist"}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={checkoutOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setCheckoutOpen(false)}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Choose Delivery Method</Text>
            <View style={styles.sheetSummary}>
              <Text style={styles.sheetSummaryText}>Qty: {quantity}</Text>
              <Text style={styles.sheetSummaryText}>
                Total: Rs. {totalPrice}
              </Text>
            </View>
            <Pressable
              style={styles.optionRow}
              onPress={() => setSelectedMethod("delivery")}
            >
              <View style={styles.radioOuter}>
                {selectedMethod === "delivery" ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Home Delivery</Text>
                <Text style={styles.optionSubtitle}>
                  Delivered to your address
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.optionRow}
              onPress={() => setSelectedMethod("pickup")}
            >
              <View style={styles.radioOuter}>
                {selectedMethod === "pickup" ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Self Pickup</Text>
                <Text style={styles.optionSubtitle}>
                  Collect from seller location
                </Text>
              </View>
            </Pressable>
            <PrimaryButton label="Continue" onPress={onContinueCheckout} />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={orderComplete} transparent animationType="fade">
        <View style={styles.successBackdrop}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: successScale }] },
            ]}
          >
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Order placed successfully</Text>
            <Text style={styles.successText}>
              Your order has been added to order history.
            </Text>
            {recentOrderMethod === "pickup" ? (
              <Text style={styles.successText}>
                You can pick up your order from the seller address.
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
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
    paddingBottom: 28,
  },
  heroImage: {
    width: "100%",
    height: 230,
    borderRadius: 18,
    backgroundColor: "#dce8e0",
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10291c",
  },
  price: {
    marginTop: 6,
    color: "#1f8f57",
    fontWeight: "800",
    fontSize: 22,
  },
  unitPrice: {
    marginTop: 2,
    color: "#5d7064",
    fontSize: 12,
    fontWeight: "600",
  },
  qtyRow: {
    marginTop: 10,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyLabel: {
    color: "#20382d",
    fontSize: 14,
    fontWeight: "700",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cfe0d5",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: "#1d7b4a",
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 20,
  },
  qtyValue: {
    minWidth: 22,
    textAlign: "center",
    color: "#123124",
    fontSize: 16,
    fontWeight: "700",
  },
  desc: {
    marginTop: 8,
    color: "#506257",
    fontSize: 14,
    lineHeight: 20,
  },
  metaBlock: {
    marginTop: 14,
    marginBottom: 14,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe8df",
    padding: 12,
    gap: 4,
  },
  meta: {
    color: "#44584d",
    fontSize: 13,
  },
  reviewCard: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbe8df",
    padding: 11,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#153126",
  },
  reviewComment: {
    marginTop: 5,
    color: "#52645a",
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  actionItem: {
    flex: 1,
  },
  wishlistButton: {
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: "#e9f7ef",
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistButtonText: {
    color: "#16663f",
    fontSize: 14,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(13, 25, 18, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    gap: 14,
  },
  sheetTitle: {
    color: "#132b1c",
    fontSize: 18,
    fontWeight: "800",
  },
  sheetSummary: {
    marginTop: -4,
    marginBottom: -2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sheetSummaryText: {
    color: "#3e5547",
    fontSize: 13,
    fontWeight: "600",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7fbf8",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1f8f57",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1f8f57",
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    color: "#123124",
    fontWeight: "700",
    fontSize: 14,
  },
  optionSubtitle: {
    marginTop: 3,
    color: "#64776b",
    fontSize: 12,
  },
  successBackdrop: {
    flex: 1,
    backgroundColor: "rgba(16, 34, 24, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  successCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
  },
  successIcon: {
    fontSize: 36,
    color: "#1f8f57",
    fontWeight: "800",
  },
  successTitle: {
    marginTop: 10,
    color: "#132b1c",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  successText: {
    marginTop: 6,
    color: "#5c6f63",
    fontSize: 13,
    textAlign: "center",
  },
});
