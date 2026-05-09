import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { RoleSelectionView } from "../components/RoleSelectionView";
import { AppProvider, useAppContext } from "../context/AppContext";
import AuthScreen from "../screens/AuthScreen";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContainer() {
  const { themeMode, role, setRole, isLoggedIn, isLoading } = useAppContext();

  // Auth check in progress — show loading spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f8f3" }}>
        <ActivityIndicator size="large" color="#1f8f57" />
      </View>
    );
  }

  // User is not logged in — show Auth screen
  if (!isLoggedIn) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  // Role not selected — show Role selection
  if (!role) {
    return <RoleSelectionView onSelectRole={setRole} />;
  }

  // Everything is fine — show main app
  return (
    <ThemeProvider value={themeMode === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ title: "Product Details" }}
        />
        <Stack.Screen name="wishlist" options={{ title: "My Wishlist" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="live" options={{ title: "Live" }} />
        <Stack.Screen name="seller-live" options={{ title: "Seller Live" }} />
        <Stack.Screen name="add-product" options={{ title: "Add Product" }} />
        <Stack.Screen
          name="edit-product/[id]"
          options={{ title: "Edit Product" }}
        />
        <Stack.Screen name="analytics" options={{ title: "Analytics" }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContainer />
    </AppProvider>
  );
}
