import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type { Role } from "../navigation/types";
import { PrimaryButton } from "./PrimaryButton";

type RoleSelectionViewProps = {
  onSelectRole: (role: Role) => void;
};

export function RoleSelectionView({ onSelectRole }: RoleSelectionViewProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandBadge}>
          <MaterialIcons name="storefront" size={22} color="#1f8f57" />
          <Text style={styles.brandText}>Local Baazar</Text>
        </View>
        <Text style={styles.heading}>Continue as Buyer or Seller?</Text>
        <Text style={styles.subText}>
          This selection is for this app session only and resets when the app
          restarts.
        </Text>

        <View style={styles.cardRow}>
          <View style={styles.roleCard}>
            <MaterialIcons name="shopping-bag" size={28} color="#1f8f57" />
            <Text style={styles.roleTitle}>Buyer</Text>
            <Text style={styles.roleDesc}>
              Browse deals, join live sessions, and place orders.
            </Text>
            <PrimaryButton
              label="Continue as Buyer"
              onPress={() => onSelectRole("buyer")}
            />
          </View>

          <View style={styles.roleCard}>
            <MaterialIcons name="inventory" size={28} color="#1f8f57" />
            <Text style={styles.roleTitle}>Seller</Text>
            <Text style={styles.roleDesc}>
              Manage products, run live selling, and process orders.
            </Text>
            <PrimaryButton
              label="Continue as Seller"
              onPress={() => onSelectRole("seller")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7f4",
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  brandBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4f5eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 6,
  },
  brandText: {
    color: "#1f8f57",
    fontWeight: "700",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#12291d",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#607267",
    marginBottom: 16,
  },
  cardRow: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 14,
    gap: 8,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#163226",
  },
  roleDesc: {
    color: "#5d6f63",
    fontSize: 13,
    marginBottom: 4,
  },
});
