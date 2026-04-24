import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type RatingStarsProps = {
  rating: number;
  size?: number;
  showLabel?: boolean;
};

export function RatingStars({
  rating,
  size = 14,
  showLabel = true,
}: RatingStarsProps) {
  const rounded = Math.round(rating);

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((index) => (
        <MaterialIcons
          key={index}
          name={index <= rounded ? "star" : "star-border"}
          size={size}
          color="#f4b400"
        />
      ))}
      {showLabel ? <Text style={styles.text}>{rating.toFixed(1)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  text: {
    marginLeft: 4,
    color: "#516056",
    fontWeight: "600",
    fontSize: 12,
  },
});
