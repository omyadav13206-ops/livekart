import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ChatPreview } from "../data/chats";

type ChatCardProps = {
  chat: ChatPreview;
  onPress: () => void;
};

export function ChatCard({ chat, onPress }: ChatCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <MaterialIcons name="person" size={18} color="#1f8f57" />
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name}>{chat.personName}</Text>
          <Text style={styles.time}>{chat.time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.message}>
          {chat.lastMessage}
        </Text>
      </View>
      {chat.unreadCount > 0 ? (
        <View style={styles.unread}>
          <Text style={styles.unreadText}>{chat.unreadCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dde9e1",
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9f6ef",
  },
  body: {
    flex: 1,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#163026",
    fontSize: 14,
    fontWeight: "700",
  },
  time: {
    color: "#627469",
    fontSize: 12,
  },
  message: {
    color: "#4d5c52",
    marginTop: 4,
    fontSize: 13,
  },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1f8f57",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  unreadText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
