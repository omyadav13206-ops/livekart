import { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  onJoinDeal: () => void;
  joined?: boolean;
};

export function ProductCard({
  product,
  onJoinDeal,
  joined = false,
}: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>Rs. {product.price}</Text>
        <Text style={styles.distance}>{product.distance}</Text>
        <Pressable
          style={[styles.button, joined && styles.buttonJoined]}
          onPress={onJoinDeal}
          disabled={joined}
        >
          <Text style={styles.buttonText}>
            {joined ? "Joined" : "Join Deal"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ProductCardSkeleton() {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  return (
    <View style={styles.card}>
      <SkeletonBlock
        style={[styles.image, styles.skeletonBlock]}
        opacity={pulse}
      />
      <View style={styles.content}>
        <SkeletonBlock
          style={[styles.skeletonLine, styles.skeletonTitle]}
          opacity={pulse}
        />
        <SkeletonBlock
          style={[styles.skeletonLine, styles.skeletonPrice]}
          opacity={pulse}
        />
        <SkeletonBlock
          style={[styles.skeletonLine, styles.skeletonDistance]}
          opacity={pulse}
        />
        <SkeletonBlock
          style={[styles.skeletonLine, styles.skeletonButton]}
          opacity={pulse}
        />
      </View>
    </View>
  );
}

function SkeletonBlock({
  style,
  opacity,
}: {
  style: object;
  opacity: Animated.Value;
}) {
  return <Animated.View style={[style, { opacity }]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 14,
    backgroundColor: "#eceff1",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1c1f26",
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#00897b",
  },
  distance: {
    marginTop: 2,
    fontSize: 13,
    color: "#607d8b",
  },
  button: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#1e88e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonJoined: {
    backgroundColor: "#43a047",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  skeletonBlock: {
    backgroundColor: "#e3e8ee",
  },
  skeletonLine: {
    height: 12,
    borderRadius: 8,
    backgroundColor: "#e3e8ee",
  },
  skeletonTitle: {
    width: "70%",
    height: 18,
    marginTop: 4,
  },
  skeletonPrice: {
    width: "35%",
    marginTop: 10,
  },
  skeletonDistance: {
    width: "45%",
    marginTop: 8,
  },
  skeletonButton: {
    width: "36%",
    height: 30,
    marginTop: 12,
    borderRadius: 10,
  },
});
