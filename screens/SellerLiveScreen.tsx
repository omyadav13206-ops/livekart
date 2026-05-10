import { useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  StatusBar,
  ScrollView,
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

export default function SellerLiveScreen() {
  const { sellerProducts, currentLiveProduct, setCurrentLiveProductById } =
    useAppContext();

  const engine = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAgora();
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
      if (!cameraOk || !micOk) {
        Alert.alert(
          "Permission Required",
          "Camera aur Microphone ki permission deni hogi live streaming ke liye.\n\nPhone Settings > Apps > local-baazar > Permissions mein jaake allow karein.",
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
      Alert.alert("Permission Needed", "Pehle Camera aur Microphone ki permission dein.");
      return;
    }
    if (!engine.current) {
      Alert.alert("Error", "Agora engine initialize nahi hua. App restart karein.");
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

      {/* Full-screen video */}
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

        {/* Bottom overlay - product info */}
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

      {/* Controls */}
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

      {/* Product switcher */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Product Switch Karein</Text>
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
  noCameraBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  noCameraText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
  permBtn: {
    backgroundColor: "#1f8f57",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  permBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 10,
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
  badgePreview: {
    backgroundColor: "#555",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  viewerBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  viewerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
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
  overlayProductName: {
    color: "#f0fff7",
    fontWeight: "700",
    fontSize: 15,
  },
  overlayProductPrice: {
    color: "#6ee49c",
    fontWeight: "800",
    fontSize: 17,
    marginTop: 2,
  },
  errorBanner: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "rgba(200,30,30,0.9)",
    borderRadius: 10,
    padding: 10,
    zIndex: 30,
  },
  errorText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#111",
  },
  startBtn: {
    backgroundColor: "#1f8f57",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  startBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  stopBtn: {
    backgroundColor: "#d62828",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  stopBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  productSection: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  productChip: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  productChipActive: {
    backgroundColor: "#0f3a22",
    borderColor: "#1f8f57",
  },
  productChipText: {
    color: "#bbb",
    fontWeight: "700",
    fontSize: 13,
  },
  productChipTextActive: {
    color: "#6ee49c",
  },
  productChipPrice: {
    color: "#777",
    fontSize: 11,
    marginTop: 2,
  },
});
