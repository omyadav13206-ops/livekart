/**
 * AuthScreen.tsx — Beautiful Login & Signup screen
 * Supabase auth ke saath integrate hai
 */

import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import * as authService from "../services/authService";

type AuthMode = "login" | "signup";

type Props = {
  onAuthSuccess: () => void;
};

export default function AuthScreen({ onAuthSuccess }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locality, setLocality] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and password are required");
      return;
    }
    if (!isLogin && !name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await authService.signIn({ email: email.trim(), password });
        onAuthSuccess();
      } else {
        const { session, user } = await authService.signUp({
          email: email.trim(),
          password,
          name: name.trim(),
          locality: locality.trim(),
        });
        
        if (user && !session) {
          setSuccessMsg("Account created! Please check your email and verify the link.");
          setMode("login");
        } else {
          setSuccessMsg("Account successfully created. Please login now.");
          setMode("login");
          onAuthSuccess();
        }
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.log("Auth Error:", err);
      const msg =
        err?.message === "Invalid login credentials"
          ? "Invalid Email/Password, or email not verified."
          : err?.message === "Email not confirmed"
          ? "Please verify your email first."
          : err?.message === "User already registered"
          ? "This email is already registered."
          : err?.message?.includes("rate limit")
          ? "Please try again later (Rate Limit Exceeded)."
          : err?.message ?? "Something went wrong, please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background blobs */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="storefront" size={32} color="#fff" />
            </View>
            <Text style={styles.brandName}>Local Baazar</Text>
            <Text style={styles.brandTagline}>
              Apne mohalle ki dukaan, ab online
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Tab switcher */}
            <View style={styles.tabRow}>
              <Pressable
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => setMode("login")}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                  Login
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => setMode("signup")}
              >
                <Text
                  style={[styles.tabText, !isLogin && styles.tabTextActive]}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>

            <Text style={styles.cardTitle}>
              {isLogin ? "Wapas aaiye! 👋" : "Naya account banao 🌱"}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isLogin
                ? "Enter your email and password"
                : "Join the Local Baazar community"}
            </Text>

            {/* Error/Success Messages */}
            {errorMsg ? (
              <View style={styles.messageBoxError}>
                <MaterialIcons name="error-outline" size={18} color="#d32f2f" />
                <Text style={styles.messageTextError}>{errorMsg}</Text>
              </View>
            ) : null}

            {successMsg ? (
              <View style={styles.messageBoxSuccess}>
                <MaterialIcons name="check-circle-outline" size={18} color="#2e7d32" />
                <Text style={styles.messageTextSuccess}>{successMsg}</Text>
              </View>
            ) : null}

            {/* Name field — only signup */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Name</Text>
                <View style={styles.inputBox}>
                  <MaterialIcons name="person" size={18} color="#7aaa8f" />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g.: Ravi Kumar"
                    placeholderTextColor="#a3b9ac"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputBox}>
                <MaterialIcons name="email" size={18} color="#7aaa8f" />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#a3b9ac"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputBox}>
                <MaterialIcons name="lock" size={18} color="#7aaa8f" />
                <TextInput
                  style={styles.input}
                  placeholder="Kam se kam 6 characters"
                  placeholderTextColor="#a3b9ac"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)}>
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={18}
                    color="#7aaa8f"
                  />
                </Pressable>
              </View>
            </View>

            {/* Locality — only signup */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Your Locality{" "}
                  <Text style={styles.optional}>(optional)</Text>
                </Text>
                <View style={styles.inputBox}>
                  <MaterialIcons name="location-on" size={18} color="#7aaa8f" />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g.: HSR Layout, Pune"
                    placeholderTextColor="#a3b9ac"
                    value={locality}
                    onChangeText={setLocality}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Submit button */}
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
                loading && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>
                    {isLogin ? "Login" : "Create Account"}
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={18}
                    color="#fff"
                  />
                </>
              )}
            </Pressable>

            {/* Switch mode */}
            <Pressable
              style={styles.switchRow}
              onPress={() => setMode(isLogin ? "signup" : "login")}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "New user? "
                  : "Already have an account? "}
                <Text style={styles.switchLink}>
                  {isLogin ? "Sign Up" : "Login"}
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            🔒 Your data is safely stored via Supabase
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#f0f8f3",
  },
  blobTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#c8eed9",
    opacity: 0.55,
  },
  blobBottom: {
    position: "absolute",
    bottom: -100,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#b9e8cc",
    opacity: 0.4,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  // Brand
  brand: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#1f8f57",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#1f8f57",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0f2a1d",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: "#4a7560",
    marginTop: 4,
  },
  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e2ede7",
  },
  // Tab
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#f0f8f3",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7a9a87",
  },
  tabTextActive: {
    color: "#1f8f57",
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f2a1d",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6b8878",
    marginBottom: 20,
  },
  // Messages
  messageBoxError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    gap: 6,
  },
  messageTextError: {
    color: "#d32f2f",
    fontSize: 13,
    flex: 1,
  },
  messageBoxSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    gap: 6,
  },
  messageTextSuccess: {
    color: "#2e7d32",
    fontSize: 13,
    flex: 1,
  },
  // Input
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3d6450",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optional: {
    fontWeight: "400",
    color: "#9ab5a5",
    textTransform: "none",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5fbf7",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#d4e8dc",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#132b1e",
    paddingVertical: Platform.OS === "android" ? 10 : 0,
  },
  // Submit
  submitBtn: {
    backgroundColor: "#1f8f57",
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
    shadowColor: "#1f8f57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnPressed: {
    backgroundColor: "#197a4b",
    shadowOpacity: 0.1,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Switch
  switchRow: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 4,
  },
  switchText: {
    fontSize: 14,
    color: "#6b8878",
  },
  switchLink: {
    color: "#1f8f57",
    fontWeight: "700",
  },
  // Footer
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#8aab98",
    marginTop: 24,
  },
});
