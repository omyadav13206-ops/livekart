import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AppTopBarProps = {
  title: string;
  subtitle?: string;
  onProfilePress: () => void;
};

export function AppTopBar({ title, subtitle, onProfilePress }: AppTopBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.iconButton} onPress={onProfilePress}>
          <MaterialIcons name="person" size={20} color="#1f8f57" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  left: {
    flex: 1,
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
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e9f7ef",
    alignItems: "center",
    justifyContent: "center",
  },
});
