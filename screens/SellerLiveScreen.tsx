import { useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
} from "react-native-agora";

import { PrimaryButton } from "../components/PrimaryButton";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";

const appId = process.env.EXPO_PUBLIC_AGORA_APP_ID || "YOUR_AGORA_APP_ID_HERE";
const channelName = "localbaazar_live";

const liveChat = [
  "Aman: Is this available in bulk?",
  "Neha: Please show packaging quality.",
  "Ravi: Can you bundle with pickles?",
  "Priya: What's the delivery ETA?",
];

export default function SellerLiveScreen() {
  const { sellerProducts, currentLiveProduct, setCurrentLiveProductById } =
    useAppContext();
  
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      leave();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === "android") {
        await requestCameraAndAudioPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.initialize({ appId });

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          setIsJoined(true);
        },
        onUserJoined: (_connection, uid) => {
          setViewerCount((prev) => prev + 1);
        },
        onUserOffline: (_connection, uid) => {
          setViewerCount((prev) => Math.max(0, prev - 1));
        },
      });

      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting
      );
      agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      agoraEngine.enableVideo();
      agoraEngine.startPreview();
    } catch (e) {
      console.log(e);
    }
  };

  const requestCameraAndAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.CAMERA"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("You can use the cameras & mic");
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      if (appId === "YOUR_AGORA_APP_ID_HERE") {
        Alert.alert("Error", "Please set your Agora App ID in SellerLiveScreen.tsx");
        return;
      }
      agoraEngineRef.current?.joinChannel({
        token: "", // Use token if enabled in Agora Console
        channelId: channelName,
        uid: 0,
        options: {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setIsJoined(false);
      setViewerCount(0);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Seller Live"
          subtitle="Start streaming to sell products"
        />

        <View style={styles.videoFrame}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          
          {isJoined ? (
            <React.Fragment>
              <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoStream} />
              <Text style={styles.viewerCount}>{viewerCount} viewers watching</Text>
            </React.Fragment>
          ) : (
            <Text style={styles.videoPlaceholder}>
              Camera Stream will appear here
            </Text>
          )}
        </View>

        {!isJoined ? (
          <PrimaryButton label="Start Live Stream" onPress={join} />
        ) : (
          <PrimaryButton label="End Live Stream" variant="ghost" onPress={leave} />
        )}

        <View style={{ marginTop: 16 }}>
          <SectionHeader
            title="Current Product On Live"
            subtitle="Buyer live updates from this state"
          />
          <View style={styles.currentProductCard}>
            <Text style={styles.currentName}>{currentLiveProduct.name}</Text>
            <Text style={styles.currentPrice}>
              Rs. {currentLiveProduct.price}
            </Text>
          </View>

          <SectionHeader
            title="Show This Product"
            subtitle="Switch product in live overlay"
          />
          {sellerProducts.map((product) => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productMeta}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>Rs. {product.price}</Text>
              </View>
              <PrimaryButton
                label="Show"
                onPress={() => setCurrentLiveProductById(product.id)}
              />
            </View>
          ))}
        </View>

        <SectionHeader title="Live Chat (Read only)" />
        {liveChat.map((message) => (
          <View key={message} style={styles.chatBubble}>
            <Text style={styles.chatText}>{message}</Text>
          </View>
        ))}
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
    paddingBottom: 22,
  },
  videoFrame: {
    height: 350,
    backgroundColor: "#101b15",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    position: "relative",
    overflow: "hidden",
  },
  videoStream: {
    width: "100%",
    height: "100%",
  },
  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#d62828",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  liveBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  videoPlaceholder: {
    color: "#c5d7cd",
    fontWeight: "600",
  },
  viewerCount: {
    position: "absolute",
    bottom: 12,
    left: 12,
    color: "#fff",
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  currentProductCard: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 12,
  },
  currentName: {
    color: "#123223",
    fontWeight: "700",
    fontSize: 15,
  },
  currentPrice: {
    marginTop: 4,
    color: "#1f8f57",
    fontWeight: "800",
    fontSize: 16,
  },
  productRow: {
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productMeta: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    color: "#173126",
    fontWeight: "700",
  },
  productPrice: {
    marginTop: 3,
    color: "#5d7065",
    fontSize: 12,
  },
  chatBubble: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dce8e0",
    padding: 10,
    marginBottom: 6,
  },
  chatText: {
    color: "#4d6255",
    fontSize: 13,
  },
});
