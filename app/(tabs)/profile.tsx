import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { ListingItem } from "../../components/ListingItem";

const myListings = [
  { id: "1", title: "Farm Fresh Tomatoes", price: 65, status: "Active" },
  { id: "2", title: "Handmade Millet Cookies", price: 140, status: "Sold Out" },
  { id: "3", title: "Raw Honey Jar", price: 220, status: "Active" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.userCard}>
          <Text style={styles.userName}>Kavya Sharma</Text>
          <Text style={styles.userMeta}>Seller Rating: 4.8 / 5</Text>
          <Text style={styles.userMeta}>Trusted Local Seller</Text>
        </View>

        <View style={styles.listingsHeader}>
          <Text style={styles.listingsTitle}>My Listings</Text>
        </View>

        <View style={styles.listingsContainer}>
          {myListings.map((item) => (
            <ListingItem
              key={item.id}
              title={item.title}
              price={item.price}
              status={item.status}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  content: {
    padding: 18,
    gap: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#102027",
  },
  userCard: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2933",
  },
  userMeta: {
    marginTop: 6,
    color: "#607d8b",
    fontSize: 14,
  },
  listingsHeader: {
    marginTop: 8,
  },
  listingsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2933",
  },
  listingsContainer: {
    marginTop: 6,
    gap: 10,
  },
});
