import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  VideoSourceType,
  createAgoraRtcEngine,
} from "react-native-agora";

import { useAppContext } from "../context/AppContext";
import * as liveChatService from "../services/liveChatService";
import type { LiveChatMessage } from "../services/liveChatService";

const APP_ID = "d98ea8fe6bea4a1582dd0248ecb28c9a";
const CHANNEL = "localbaazar_live";
const TOKEN = "";
const UID = 0;

export default function SellerLiveScreen() {
  const { sellerProducts, currentLiveProduct, setCurrentLiveProductById, userId, userProfile } =
    useAppContext();

  // ── Agora state ──
  const engine = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Live chat state ──
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    initAgora();
    loadMessages();

    const unsubscribe = liveChatService.subscribeToLiveChat(CHANNEL, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      engine.current?.leaveChannel();
      engine.current?.release();
      unsubscribe();
    };
  }, []);

  const loadMessages = async () => {
    try {
      const history = await liveChatService.getRecentLiveChatMessages(CHANNEL);
      setMessages(history);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (_) {}
  };

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || !userId || sending) return;
    setSending(true);
    setChatInput("");
    try {
      await liveChatService.sendLiveChatMessage({
        channelName: CHANNEL,
        senderId: userId,
        senderName: userProfile.name || "Seller",
        message: text,
      });
    } catch (_) {
      setChatInput(text);
    } finally {
      setSending(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== "android") return true;
    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      const cameraOk =
        result["android.permission.CAMERA"] === PermissionsAndroid.RESULTS.GRANTED;
      const micOk =
        result["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED;
      if (!cameraOk || !micOk) {
        Alert.alert(
          "Permission Required",
          "Camera and Microphone permissions are required for live streaming.\n\nGo to Phone Settings > Apps > local-baazar > Permissions and allow them.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const initAgora = async () => {
    const ok = await requestPermissions();
    setPermissionsGranted(ok);
    if (!ok) return;

    try {
      engine.current = createAgoraRtcEngine();
      engine.current.initialize({
        appId: APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      engine.current.registerEventHandler({
        onError: (errCode) => {
          setError(`Agora Error: ${errCode}`);
        },
        onJoinChannelSuccess: (_conn, elapsed) => {
          setIsJoined(true);
          setError(null);
        },
        onLeaveChannel: () => {
          setIsJoined(false);
          setViewerCount(0);
        },
        onUserJoined: (_conn, uid) => {
          setViewerCount((p) => p + 1);
        },
        onUserOffline: (_conn, uid) => {
          setViewerCount((p) => Math.max(0, p - 1));
        },
      });

      engine.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      engine.current.enableVideo();
      engine.current.enableAudio();
      engine.current.startPreview();
    } catch (e: any) {
      setError(`Init failed: ${e?.message || e}`);
      Alert.alert("Setup Error", `${e?.message || e}`);
    }
  };

  const startLive = async () => {
    if (!permissionsGranted) {
      Alert.alert("Permission Needed", "Please grant Camera and Microphone permissions first.");
      return;
    }
    if (!engine.current) {
      Alert.alert("Error", "Agora engine failed to initialize. Please restart the app.");
      return;
    }
    try {
      engine.current.joinChannel(TOKEN, CHANNEL, UID, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishCameraTrack: true,
        publishMicrophoneTrack: true,
      });
    } catch (e: any) {
      Alert.alert("Join Error", `${e?.message || e}`);
    }
  };

  const stopLive = () => {
    engine.current?.leaveChannel();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ── Full-screen video preview ── */}
      <View style={styles.videoContainer}>
        {permissionsGranted ? (
          <RtcSurfaceView
            style={styles.video}
            canvas={{ uid: UID, sourceType: VideoSourceType.VideoSourceCamera }}
            zOrderMediaOverlay
          />
        ) : (
          <View style={styles.noCameraBox}>
            <Text style={styles.noCameraText}>📷 Camera Permission Required</Text>
            <TouchableOpacity style={styles.permBtn} onPress={initAgora}>
              <Text style={styles.permBtnText}>Allow Permission</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Top overlay */}
        <View style={styles.topBar}>
          <View style={[styles.badge, isJoined ? styles.badgeLive : styles.badgePreview]}>
            <Text style={styles.badgeText}>{isJoined ? "🔴 LIVE" : "📷 PREVIEW"}</Text>
          </View>
          {isJoined && (
            <View style={styles.viewerBadge}>
              <Text style={styles.viewerText}>👁 {viewerCount}</Text>
            </View>
          )}
        </View>

        {/* Bottom product overlay */}
        {isJoined && (
          <View style={styles.productOverlay}>
            <Text style={styles.overlayProductName}>{currentLiveProduct?.name}</Text>
            <Text style={styles.overlayProductPrice}>Rs. {currentLiveProduct?.price}</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* ── Controls ── */}
      <View style={styles.controls}>
        {!isJoined ? (
          <TouchableOpacity style={styles.startBtn} onPress={startLive}>
            <Text style={styles.startBtnText}>🎬 Start Live Stream</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopLive}>
            <Text style={styles.stopBtnText}>⏹ End Live Stream</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Product switcher ── */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Switch Product</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sellerProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.productChip,
                currentLiveProduct?.id === product.id && styles.productChipActive,
              ]}
              onPress={() => setCurrentLiveProductById(product.id)}
            >
              <Text
                style={[
                  styles.productChipText,
                  currentLiveProduct?.id === product.id && styles.productChipTextActive,
                ]}
              >
                {product.name}
              </Text>
              <Text style={styles.productChipPrice}>Rs. {product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Live Chat ── */}
      <KeyboardAvoidingView
        style={styles.chatSection}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.chatTitle}>💬 Viewer Chat</Text>

        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <Text style={styles.chatEmpty}>No messages yet. Start chatting! 👋</Text>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  msg.senderId === userId && styles.chatBubbleMine,
                ]}
              >
                {msg.senderId !== userId && (
                  <Text style={styles.chatSender}>{msg.senderName}</Text>
                )}
                <Text
                  style={[
                    styles.chatText,
                    msg.senderId === userId && styles.chatTextMine,
                  ]}
                >
                  {msg.message}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Reply to your viewers..."
            placeholderTextColor="#555"
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!chatInput.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSendMessage}
            disabled={!chatInput.trim() || sending}
            activeOpacity={0.75}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },

  // Video
  videoContainer: { flex: 1, backgroundColor: "#111", position: "relative" },
  video: { flex: 1 },
  noCameraBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  noCameraText: { color: "#aaa", fontSize: 16, textAlign: "center" },
  permBtn: { backgroundColor: "#1f8f57", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  permBtnText: { color: "#fff", fontWeight: "700" },

  // Top bar
  topBar: { position: "absolute", top: 16, left: 16, right: 16, flexDirection: "row", gap: 10, zIndex: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeLive: { backgroundColor: "#d62828" },
  badgePreview: { backgroundColor: "#555" },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  viewerBadge: { backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  viewerText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  // Product overlay
  productOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(10, 30, 20, 0.88)",
    borderRadius: 12,
    padding: 12,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "rgba(100,200,140,0.2)",
  },
  overlayProductName: { color: "#f0fff7", fontWeight: "700", fontSize: 15 },
  overlayProductPrice: { color: "#6ee49c", fontWeight: "800", fontSize: 17, marginTop: 2 },

  // Error
  errorBanner: { position: "absolute", bottom: 80, left: 16, right: 16, backgroundColor: "rgba(200,30,30,0.9)", borderRadius: 10, padding: 10, zIndex: 30 },
  errorText: { color: "#fff", fontSize: 12, textAlign: "center" },

  // Controls
  controls: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#111" },
  startBtn: { backgroundColor: "#1f8f57", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  startBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  stopBtn: { backgroundColor: "#d62828", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  stopBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  // Product switcher
  productSection: { backgroundColor: "#1a1a1a", paddingVertical: 12, paddingHorizontal: 16 },
  sectionTitle: { color: "#aaa", fontSize: 12, fontWeight: "600", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 },
  productChip: { backgroundColor: "#2a2a2a", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, borderWidth: 1, borderColor: "#333" },
  productChipActive: { backgroundColor: "#0f3a22", borderColor: "#1f8f57" },
  productChipText: { color: "#bbb", fontWeight: "700", fontSize: 13 },
  productChipTextActive: { color: "#6ee49c" },
  productChipPrice: { color: "#777", fontSize: 11, marginTop: 2 },

  // Chat section
  chatSection: {
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    maxHeight: 200,
  },
  chatTitle: { color: "#555", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  chatScroll: { flex: 1, marginBottom: 8 },
  chatEmpty: { color: "#444", fontSize: 13, textAlign: "center", paddingVertical: 6 },
  chatBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
    maxWidth: "82%",
    borderLeftWidth: 2,
    borderLeftColor: "#2a5c3a",
  },
  chatBubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#0f3520",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 4,
    borderLeftWidth: 0,
    borderRightWidth: 2,
    borderRightColor: "#1f8f57",
  },
  chatSender: { color: "#6ee49c", fontSize: 11, fontWeight: "700", marginBottom: 2 },
  chatText: { color: "#ccc", fontSize: 13, lineHeight: 18 },
  chatTextMine: { color: "#e8fff2" },

  // Input row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    paddingTop: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1f8f57",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#1a3a28", opacity: 0.5 },
  sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
