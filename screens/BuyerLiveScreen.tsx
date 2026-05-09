import { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  PermissionsAndroid,
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

const chatMessages = [
  "Asha: This looks fresh!",
  "Rohan: Price seems great for today.",
  "Meera: Added to cart already.",
  "Vikram: Do we get same-day delivery?",
];

export default function BuyerLiveScreen() {
  const { currentLiveProduct, liveUpdatePulseKey } = useAppContext();
  const pulse = useRef(new Animated.Value(1)).current;

  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);

  useEffect(() => {
    pulse.setValue(0.92);
    Animated.spring(pulse, {
      toValue: 1,
      friction: 5,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [liveUpdatePulseKey, pulse]);

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
          setRemoteUid(uid);
        },
        onUserOffline: (_connection, uid) => {
          if (uid === remoteUid) {
            setRemoteUid(0);
          }
        },
      });

      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting
      );
      agoraEngine.setClientRole(ClientRoleType.ClientRoleAudience);
      agoraEngine.enableVideo();
      
      join(); // Automatically try to join when screen opens
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
    if (isJoined || appId === "YOUR_AGORA_APP_ID_HERE") {
      return;
    }
    try {
      agoraEngineRef.current?.joinChannel({
        token: "", // Use token if enabled in Agora Console
        channelId: channelName,
        uid: 0,
        options: {
          clientRoleType: ClientRoleType.ClientRoleAudience,
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
      setRemoteUid(0);
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
          title="Live Session"
          subtitle="Watch seller and buy products"
        />

        <View style={styles.videoFrame}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          
          {isJoined && remoteUid !== 0 ? (
            <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoStream} />
          ) : (
            <Text style={styles.placeholder}>
              {isJoined ? "Waiting for seller..." : "Joining live stream..."}
            </Text>
          )}

          <Animated.View
            style={[styles.overlay, { transform: [{ scale: pulse }] }]}
          >
            <Text style={styles.productName}>{currentLiveProduct.name}</Text>
            <Text style={styles.productPrice}>
              Rs. {currentLiveProduct.price}
            </Text>
            <PrimaryButton label="Buy Now" onPress={() => {}} />
          </Animated.View>
        </View>

        <SectionHeader title="Chat" subtitle="Mock live conversation" />
        {chatMessages.map((message) => (
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
    height: 380,
    borderRadius: 18,
    backgroundColor: "#111f17",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },
  videoStream: {
    width: "100%",
    height: "100%",
  },
  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#d62828",
    zIndex: 10,
  },
  liveBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  placeholder: {
    color: "#b7cbbe",
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 14,
    backgroundColor: "rgba(17, 48, 33, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(167, 213, 185, 0.25)",
    padding: 12,
  },
  productName: {
    color: "#f1fff7",
    fontSize: 16,
    fontWeight: "700",
  },
  productPrice: {
    marginVertical: 6,
    color: "#b2f0ca",
    fontWeight: "800",
    fontSize: 16,
  },
  chatBubble: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dce8e0",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 6,
  },
  chatText: {
    color: "#4d6257",
    fontSize: 13,
  },
});
