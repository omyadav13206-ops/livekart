import { Pressable, StyleSheet, Text } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  variant = "solid",
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === "solid" ? styles.solid : styles.ghost,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.label,
          variant === "solid" ? styles.solidLabel : styles.ghostLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  solid: {
    backgroundColor: "#1f8f57",
  },
  ghost: {
    backgroundColor: "#e9f7ef",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
  solidLabel: {
    color: "#ffffff",
  },
  ghostLabel: {
    color: "#16663f",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
