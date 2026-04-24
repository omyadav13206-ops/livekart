import { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { Product } from "../data/products";
import { PrimaryButton } from "./PrimaryButton";
import { RatingStars } from "./RatingStars";

type ProductCardProps = {
  product: Product;
  mode?: "buyer" | "seller";
  onPress: () => void;
  onPrimaryPress?: () => void;
  primaryLabel?: string;
  joined?: boolean;
};

export function ProductCard({
  product,
  mode = "buyer",
  onPress,
  onPrimaryPress,
  primaryLabel,
  joined = false,
}: ProductCardProps) {
  const defaultLabel =
    mode === "seller" ? "Edit" : joined ? "Joined" : "View Details";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.price}>Rs. {product.price}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {product.shortDescription}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {product.locality} • {product.distance}
          </Text>
          <RatingStars rating={product.rating} size={12} />
        </View>

        {mode === "seller" ? (
          <Text style={styles.stockText}>
            Stock: {product.stockStatus.replace("-", " ")}
          </Text>
        ) : null}

        <View style={styles.buttonWrap}>
          <PrimaryButton
            label={primaryLabel ?? defaultLabel}
            onPress={onPrimaryPress ?? onPress}
            disabled={joined && mode === "buyer"}
            variant={mode === "seller" ? "ghost" : "solid"}
          />
        </View>
      </View>
    </Pressable>
  );
}

export function ProductCardSkeleton() {
  const pulse = useRef(new Animated.Value(0.42)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.42,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
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
          style={[styles.skeletonLine, styles.skeletonDesc]}
          opacity={pulse}
        />
        <SkeletonBlock
          style={[styles.skeletonLine, styles.skeletonMeta]}
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dce8e0",
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#dfe9e2",
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#10261a",
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f8f57",
  },
  description: {
    marginTop: 6,
    color: "#55655b",
    fontSize: 13,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    color: "#64776b",
    fontSize: 12,
    fontWeight: "500",
  },
  stockText: {
    marginTop: 8,
    color: "#1c6d44",
    fontWeight: "600",
    textTransform: "capitalize",
    fontSize: 12,
  },
  buttonWrap: {
    marginTop: 10,
  },
  skeletonBlock: {
    backgroundColor: "#e4ebe6",
  },
  skeletonLine: {
    borderRadius: 8,
    backgroundColor: "#e4ebe6",
  },
  skeletonTitle: {
    width: "68%",
    height: 18,
  },
  skeletonDesc: {
    marginTop: 8,
    width: "85%",
    height: 12,
  },
  skeletonMeta: {
    marginTop: 8,
    width: "52%",
    height: 12,
  },
  skeletonButton: {
    marginTop: 12,
    width: "38%",
    height: 36,
  },
});
