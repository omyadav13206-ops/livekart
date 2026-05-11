import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
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

export default function BuyerLiveScreen() {
  const { currentLiveProduct, liveUpdatePulseKey, placeOrder, userId, userProfile } =
    useAppContext();

  // ── Animated pulse for product overlay ──
  const pulse = useRef(new Animated.Value(1)).current;

  // ── Agora state ──
  const engine = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [status, setStatus] = useState("Joining...");

  // ── Live chat state ──
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // ── Purchase modal state ──
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ── Pulse animation when product changes ──
  useEffect(() => {
    pulse.setValue(0.92);
    Animated.spring(pulse, {
      toValue: 1,
      friction: 5,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [liveUpdatePulseKey]);

  // ── Init Agora + subscribe to live chat ──
  useEffect(() => {
    initAndJoin();
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
        senderName: userProfile.name || "Guest",
        message: text,
      });
    } catch (_) {
      setChatInput(text); // restore on error
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
      return (
        result["android.permission.CAMERA"] === PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch {
      return true;
    }
  };

  const initAndJoin = async () => {
    await requestPermissions();
    try {
      engine.current = createAgoraRtcEngine();
      engine.current.initialize({
        appId: APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      engine.current.registerEventHandler({
        onJoinChannelSuccess: () => {
          setIsJoined(true);
          setStatus("Waiting for seller to join...");
        },
        onUserJoined: (_conn, uid) => {
          setRemoteUid(uid);
          setStatus("Live stream is active!");
        },
        onUserOffline: (_conn, uid) => {
          if (uid === remoteUid) {
            setRemoteUid(null);
            setStatus("Seller has ended the stream.");
          }
        },
        onLeaveChannel: () => {
          setIsJoined(false);
          setStatus("Disconnected");
        },
        onError: (errCode) => setStatus(`Error: ${errCode}`),
      });
      engine.current.setClientRole(ClientRoleType.ClientRoleAudience);
      engine.current.enableVideo();
      engine.current.muteLocalAudioStream(true);
      engine.current.muteLocalVideoStream(true);
      engine.current.joinChannel(TOKEN, CHANNEL, UID, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
        publishCameraTrack: false,
        publishMicrophoneTrack: false,
      });
    } catch (e: any) {
      setStatus(`Setup Error: ${e?.message || e}`);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentLiveProduct || ordering) return;
    setOrdering(true);
    try {
      await placeOrder(currentLiveProduct.id, deliveryMethod, quantity);
      setOrderSuccess(true);
      setTimeout(() => {
        setModalVisible(false);
        setOrderSuccess(false);
        setQuantity(1);
        setDeliveryMethod("delivery");
      }, 2200);
    } catch {
      alert("Order failed. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  const totalPrice = (currentLiveProduct?.price ?? 0) * quantity;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ── Full-screen video ── */}
      <View style={styles.videoContainer}>
        {remoteUid !== null ? (
          <RtcSurfaceView
            style={styles.video}
            canvas={{ uid: remoteUid, sourceType: VideoSourceType.VideoSourceRemote }}
            zOrderMediaOverlay
          />
        ) : (
          <View style={styles.waitingBox}>
            <Text style={styles.waitingEmoji}>📺</Text>
            <Text style={styles.waitingText}>{status}</Text>
          </View>
        )}

        {/* Live badge */}
        <View style={styles.topBar}>
          <View style={[styles.badge, isJoined ? styles.badgeLive : styles.badgeConnecting]}>
            <Text style={styles.badgeText}>
              {isJoined ? (remoteUid ? "🔴 LIVE" : "⏳ Waiting") : "⟳ Connecting"}
            </Text>
          </View>
        </View>

        {/* Product overlay */}
        <Animated.View style={[styles.productOverlay, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.overlayLabel}>Featured Product</Text>
          <Text style={styles.overlayProductName}>{currentLiveProduct?.name}</Text>
          <Text style={styles.overlayProductPrice}>Rs. {currentLiveProduct?.price}</Text>
          <TouchableOpacity
            style={styles.buyBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.buyBtnText}>🛒 Buy Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── Live Chat Section ── */}
      <KeyboardAvoidingView
        style={styles.chatSection}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.chatTitle}>💬 Live Chat</Text>

        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <Text style={styles.chatEmpty}>No messages yet. Say hello! 👋</Text>
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
            placeholder={userId ? "Type a message..." : "Login to chat"}
            placeholderTextColor="#555"
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            editable={!!userId}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!chatInput.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSendMessage}
            disabled={!chatInput.trim() || sending || !userId}
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

      {/* ── Purchase Modal ── */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismiss}
            activeOpacity={1}
            onPress={() => !ordering && setModalVisible(false)}
          />
          <View style={styles.sheet}>
            {orderSuccess ? (
              <View style={styles.successBox}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>Order Placed!</Text>
                <Text style={styles.successSub}>
                  {currentLiveProduct?.name} has been added to your orders.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Quick Purchase</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.sheetClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.sheetProductBox}>
                  <Text style={styles.sheetProductName}>{currentLiveProduct?.name}</Text>
                  <Text style={styles.sheetProductPrice}>
                    Rs. {currentLiveProduct?.price} / unit
                  </Text>
                </View>

                <Text style={styles.fieldLabel}>Quantity</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyVal}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity((q) => q + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.fieldLabel}>Delivery Method</Text>
                <View style={styles.methodRow}>
                  <TouchableOpacity
                    style={[styles.methodBtn, deliveryMethod === "delivery" && styles.methodBtnActive]}
                    onPress={() => setDeliveryMethod("delivery")}
                  >
                    <Text style={[styles.methodBtnText, deliveryMethod === "delivery" && styles.methodBtnTextActive]}>
                      🏠 Home Delivery
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.methodBtn, deliveryMethod === "pickup" && styles.methodBtnActive]}
                    onPress={() => setDeliveryMethod("pickup")}
                  >
                    <Text style={[styles.methodBtnText, deliveryMethod === "pickup" && styles.methodBtnTextActive]}>
                      📦 Self Pickup
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>Rs. {totalPrice}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.confirmBtn, ordering && styles.confirmBtnDisabled]}
                  onPress={handlePlaceOrder}
                  disabled={ordering}
                  activeOpacity={0.85}
                >
                  {ordering ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmBtnText}>✅ Confirm Order</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },

  // Video
  videoContainer: { flex: 1, backgroundColor: "#111", position: "relative" },
  video: { flex: 1 },
  waitingBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  waitingEmoji: { fontSize: 48 },
  waitingText: { color: "#aaa", fontSize: 16, textAlign: "center", paddingHorizontal: 32 },

  // Top badge
  topBar: { position: "absolute", top: 16, left: 16, zIndex: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeLive: { backgroundColor: "#d62828" },
  badgeConnecting: { backgroundColor: "#555" },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // Product overlay
  productOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(10, 30, 20, 0.90)",
    borderRadius: 16,
    padding: 14,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "rgba(100,200,140,0.25)",
  },
  overlayLabel: { color: "#6ee49c", fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  overlayProductName: { color: "#f0fff7", fontWeight: "700", fontSize: 16 },
  overlayProductPrice: { color: "#6ee49c", fontWeight: "800", fontSize: 18, marginTop: 2, marginBottom: 10 },
  buyBtn: { backgroundColor: "#1f8f57", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  buyBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  // Chat section
  chatSection: {
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    maxHeight: 230,
  },
  chatTitle: { color: "#555", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  chatScroll: { flex: 1, marginBottom: 8 },
  chatEmpty: { color: "#444", fontSize: 13, textAlign: "center", paddingVertical: 10 },
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

  // Purchase modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalDismiss: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: "#2a2a2a",
    gap: 14,
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sheetTitle: { color: "#f0fff7", fontSize: 18, fontWeight: "800" },
  sheetClose: { color: "#666", fontSize: 18, fontWeight: "700", padding: 4 },
  sheetProductBox: { backgroundColor: "#222", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#2e2e2e" },
  sheetProductName: { color: "#e8fff2", fontWeight: "700", fontSize: 15 },
  sheetProductPrice: { color: "#6ee49c", fontWeight: "600", fontSize: 13, marginTop: 4 },
  fieldLabel: { color: "#888", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  qtyBtn: { width: 42, height: 42, backgroundColor: "#2a2a2a", borderRadius: 10, borderWidth: 1, borderColor: "#3a3a3a", alignItems: "center", justifyContent: "center" },
  qtyBtnText: { color: "#6ee49c", fontSize: 22, fontWeight: "800", lineHeight: 26 },
  qtyVal: { color: "#fff", fontSize: 22, fontWeight: "800", minWidth: 32, textAlign: "center" },
  methodRow: { flexDirection: "row", gap: 10 },
  methodBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#222", borderWidth: 1.5, borderColor: "#333", alignItems: "center" },
  methodBtnActive: { borderColor: "#1f8f57", backgroundColor: "#0f2e1a" },
  methodBtnText: { color: "#555", fontWeight: "700", fontSize: 13 },
  methodBtnTextActive: { color: "#6ee49c" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#222", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#2e2e2e" },
  totalLabel: { color: "#aaa", fontWeight: "700", fontSize: 14 },
  totalValue: { color: "#6ee49c", fontWeight: "800", fontSize: 18 },
  confirmBtn: { backgroundColor: "#1f8f57", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  confirmBtnDisabled: { opacity: 0.55 },
  confirmBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  // Order success
  successBox: { alignItems: "center", paddingVertical: 24 },
  successIcon: { fontSize: 44, marginBottom: 12 },
  successTitle: { color: "#f0fff7", fontSize: 20, fontWeight: "800" },
  successSub: { color: "#8ecfaa", fontSize: 13, textAlign: "center", marginTop: 8, lineHeight: 19 },
});
