import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ProfileMenuItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export function ProfileMenuItem({
  icon,
  label,
  onPress,
}: ProfileMenuItemProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.iconWrap}>
        <MaterialIcons name={icon} size={19} color="#1f8f57" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <MaterialIcons name="chevron-right" size={20} color="#89a093" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#dfebe3",
    marginBottom: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ebf7ef",
    marginRight: 10,
  },
  label: {
    flex: 1,
    color: "#103323",
    fontWeight: "600",
    fontSize: 14,
  },
});
