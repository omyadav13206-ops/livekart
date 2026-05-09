import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { ProfileMenuItem } from "../components/ProfileMenuItem";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";
import { AppRoutes } from "../navigation/routes";
import * as authService from "../services/authService";

export default function ProfileScreen() {
  const {
    role,
    toggleTheme,
    setRole,
    themeMode,
    userProfile,
    updateUserProfile,
  } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [locality, setLocality] = useState(userProfile.locality);
  const [avatar, setAvatar] = useState(userProfile.avatar);

  useEffect(() => {
    setName(userProfile.name);
    setLocality(userProfile.locality);
    setAvatar(userProfile.avatar);
  }, [userProfile]);

  const onSaveProfile = () => {
    updateUserProfile({
      name,
      locality,
      avatar,
    });
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="My Profile" />

        <View style={styles.profileCard}>
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userProfile.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {role === "seller" ? "Seller" : "Buyer"}
              </Text>
            </View>
            <Text style={styles.meta}>Locality: {userProfile.locality}</Text>
            <Text style={styles.meta}>Joined: {userProfile.joinedSince}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Orders</Text>
            <Text style={styles.statValue}>42</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Saved</Text>
            <Text style={styles.statValue}>18</Text>
          </View>
          {role === "seller" ? (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>
                {userProfile.sellerRating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>

        <SectionHeader title="Menu" subtitle="Actions for this mode" />
        <ProfileMenuItem
          icon="edit"
          label="Edit Info"
          onPress={() => setEditing((current) => !current)}
        />
        <ProfileMenuItem
          icon={themeMode === "dark" ? "light-mode" : "dark-mode"}
          label={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
          onPress={toggleTheme}
        />
        <ProfileMenuItem
          icon="help-outline"
          label="Help & Support"
          onPress={() => {}}
        />

        {editing ? (
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit Profile Details</Text>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.fieldLabel}>Locality</Text>
            <TextInput
              style={styles.input}
              value={locality}
              onChangeText={setLocality}
            />
            <Text style={styles.fieldLabel}>Avatar URL</Text>
            <TextInput
              style={styles.input}
              value={avatar}
              onChangeText={setAvatar}
            />
            <View style={styles.editButtons}>
              <View style={styles.buttonWrap}>
                <ProfileMenuItem
                  icon="check"
                  label="Save Changes"
                  onPress={onSaveProfile}
                />
              </View>
              <View style={styles.buttonWrap}>
                <ProfileMenuItem
                  icon="close"
                  label="Cancel"
                  onPress={() => setEditing(false)}
                />
              </View>
            </View>
          </View>
        ) : null}

        {role === "seller" ? (
          <>
            <ProfileMenuItem
              icon="dashboard"
              label="Seller Dashboard"
              onPress={() => router.push(AppRoutes.tabsHome)}
            />
            <ProfileMenuItem
              icon="inventory"
              label="Manage Products"
              onPress={() => router.push(AppRoutes.addProduct)}
            />
            <ProfileMenuItem
              icon="live-tv"
              label="Start Live"
              onPress={() => router.push(AppRoutes.sellerLive)}
            />
            <ProfileMenuItem
              icon="query-stats"
              label="Analytics"
              onPress={() => router.push(AppRoutes.analytics)}
            />
          </>
        ) : (
          <ProfileMenuItem
            icon="tune"
            label="Buyer Preferences"
            onPress={() => {}}
          />
        )}

        <ProfileMenuItem
          icon="swap-horiz"
          label="Switch Role"
          onPress={() => setRole(null)}
        />
        <ProfileMenuItem
          icon="logout"
          label="Logout"
          onPress={() =>
            Alert.alert("Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                  setRole(null);
                  await authService.signOut();
                },
              },
            ])
          }
        />
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
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 14,
    flexDirection: "row",
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#dbe8df",
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#123124",
  },
  roleBadge: {
    marginTop: 5,
    alignSelf: "flex-start",
    borderRadius: 10,
    backgroundColor: "#e8f6ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleBadgeText: {
    color: "#1f8f57",
    fontWeight: "700",
    fontSize: 12,
  },
  meta: {
    marginTop: 4,
    color: "#5c6f63",
    fontSize: 13,
  },
  statsRow: {
    marginTop: 12,
    marginBottom: 12,
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 10,
  },
  statLabel: {
    color: "#6a7d72",
    fontSize: 12,
  },
  statValue: {
    marginTop: 6,
    color: "#153226",
    fontSize: 17,
    fontWeight: "800",
  },
  editCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dce8e0",
    backgroundColor: "#ffffff",
    padding: 14,
  },
  editTitle: {
    color: "#123124",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  fieldLabel: {
    marginTop: 10,
    marginBottom: 5,
    color: "#5c6f63",
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d4e3da",
    backgroundColor: "#fdfefe",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#173126",
  },
  editButtons: {
    marginTop: 12,
    gap: 8,
  },
  buttonWrap: {
    width: "100%",
  },
});
