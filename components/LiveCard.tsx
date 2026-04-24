import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { LiveSession } from "../data/liveSessions";

type LiveCardProps = {
  session: LiveSession;
  onPress: () => void;
};

export function LiveCard({ session, onPress }: LiveCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: session.coverImage }} style={styles.image} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>LIVE</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {session.title}
        </Text>
        <Text style={styles.meta}>
          {session.hostName} • {session.viewers} watching
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 230,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#deece3",
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#e6ece8",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#d62828",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  info: {
    padding: 10,
  },
  title: {
    color: "#112418",
    fontWeight: "700",
  },
  meta: {
    marginTop: 4,
    color: "#5f6f64",
    fontSize: 12,
  },
});
