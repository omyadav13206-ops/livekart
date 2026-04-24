import { StyleSheet, Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  rightText?: string;
};

export function SectionHeader({
  title,
  subtitle,
  rightText,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  left: {
    flexShrink: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f291b",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#5d6d63",
  },
  rightText: {
    fontSize: 13,
    color: "#1f8f57",
    fontWeight: "600",
  },
});
