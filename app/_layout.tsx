import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { RoleSelectionView } from "../components/RoleSelectionView";
import { AppProvider, useAppContext } from "../context/AppContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContainer() {
  const { themeMode, role, setRole } = useAppContext();

  if (!role) {
    return <RoleSelectionView onSelectRole={setRole} />;
  }

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
