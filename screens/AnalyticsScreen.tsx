import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { SectionHeader } from "../components/SectionHeader";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Analytics" subtitle="Mock seller insights" />

        <View style={styles.revenueCard}>
          <Text style={styles.metricLabel}>Monthly Revenue</Text>
          <Text style={styles.metricValue}>Rs. 1,24,560</Text>
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Sales Chart Placeholder</Text>
        </View>

        <SectionHeader title="Top Products" />
        <View style={styles.listItem}>
          <Text style={styles.itemName}>Fresh Mango Box</Text>
          <Text style={styles.itemMeta}>Rs. 36,000 revenue</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemName}>Homemade Pickles</Text>
          <Text style={styles.itemMeta}>Rs. 19,200 revenue</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemName}>Fresh Coriander Bundle</Text>
          <Text style={styles.itemMeta}>Rs. 9,750 revenue</Text>
        </View>
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
    paddingBottom: 24,
  },
  revenueCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce8e0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  metricLabel: {
    color: "#627469",
    fontSize: 12,
  },
  metricValue: {
    marginTop: 6,
    color: "#153125",
    fontWeight: "800",
    fontSize: 22,
  },
  chartPlaceholder: {
    height: 170,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#b8cdc0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fcfa",
    marginBottom: 12,
  },
  placeholderText: {
    color: "#72867b",
  },
  listItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
  },
  itemName: {
    color: "#153125",
    fontWeight: "700",
    fontSize: 14,
  },
  itemMeta: {
    marginTop: 3,
    color: "#5e7064",
    fontSize: 12,
  },
});
