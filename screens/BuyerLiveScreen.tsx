import { useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Animated,
} from "react-native";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  VideoSourceType,
} from "react-native-agora";
import { useAppContext } from "../context/AppContext";

const APP_ID = "your agora app id ";
const CHANNEL = "localbaazar_live";
const TOKEN = "";
const UID = 0;

const chatMessages = [
  "Asha: This looks fresh! 😍",
  "Rohan: Price ekdum sahi hai!",
  "Meera: Cart mein add kar liya ✅",
  "Vikram: Same-day delivery milegi?",
];

export default function BuyerLiveScreen() {
  const { currentLiveProduct, liveUpdatePulseKey } = useAppContext();
  const pulse = useRef(new Animated.Value(1)).current;

  const engine = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [status, setStatus] = useState("Joining...");

  useEffect(() => {
    pulse.setValue(0.92);
    Animated.spring(pulse, {
      toValue: 1,
      friction: 5,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [liveUpdatePulseKey]);

  useEffect(() => {
    initAndJoin();
    return () => {
      engine.current?.leaveChannel();
      engine.current?.release();
    };
  }, []);

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
      return cameraOk && micOk;
    } catch {
      return true; // Viewer doesn't strictly need cam/mic, continue anyway
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
          setStatus("Seller ka wait kar rahe hain...");
        },
        onUserJoined: (_conn, uid) => {
          setRemoteUid(uid);
          setStatus("Live chal rahi hai!");
        },
        onUserOffline: (_conn, uid) => {
          if (uid === remoteUid) {
            setRemoteUid(null);
            setStatus("Seller ne stream band kar di.");
          }
        },
        onLeaveChannel: () => {
          setIsJoined(false);
          setStatus("Disconnected");
        },
        onError: (errCode) => {
          setStatus(`Error: ${errCode}`);
        },
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

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Full-screen video */}
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
          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>🛒 Buy Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Chat */}
      <View style={styles.chatSection}>
        <Text style={styles.chatTitle}>💬 Live Chat</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {chatMessages.map((msg, i) => (
            <View key={i} style={styles.chatBubble}>
              <Text style={styles.chatText}>{msg}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#111",
    position: "relative",
  },
  video: {
    flex: 1,
  },
  waitingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  waitingEmoji: {
    fontSize: 48,
  },
  waitingText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeLive: {
    backgroundColor: "#d62828",
  },
  badgeConnecting: {
    backgroundColor: "#555",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
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
  overlayLabel: {
    color: "#6ee49c",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  overlayProductName: {
    color: "#f0fff7",
    fontWeight: "700",
    fontSize: 16,
  },
  overlayProductPrice: {
    color: "#6ee49c",
    fontWeight: "800",
    fontSize: 18,
    marginTop: 2,
    marginBottom: 10,
  },
  buyBtn: {
    backgroundColor: "#1f8f57",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buyBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  chatSection: {
    height: 170,
    backgroundColor: "#151515",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  chatTitle: {
    color: "#777",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chatBubble: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 5,
    borderLeftWidth: 2,
    borderLeftColor: "#1f8f57",
  },
  chatText: {
    color: "#ccc",
    fontSize: 13,
  },
});

