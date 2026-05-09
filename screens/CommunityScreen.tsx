import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";

import { AppTopBar } from "../components/AppTopBar";
import { ChatCard } from "../components/ChatCard";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";
import { AppRoutes } from "../navigation/routes";

export default function CommunityScreen() {
  const { chats, setSelectedChat } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppTopBar
          title=""
          onProfilePress={() => router.push(AppRoutes.profile)}
        />
         <SectionHeader
          title="My Feed"
          subtitle="Posts and reels from the community"
        />
        <Text style={styles.snippet}>
          Reels and posts will appear here........
        </Text>
        <Text style={styles.snippet}>
          Reels and posts will appear here........
        </Text>
        <Text style={styles.snippet}>
          Reels and posts will appear here........
        </Text>
        <Text style={styles.snippet}>
          Reels and posts will appear here........
        </Text>
        <Text style={styles.snippet}>
          Reels and posts will appear here........
        </Text>
        <SectionHeader
          title="Recent Conversations"
          subtitle="Social commerce interactions"
        />

        {chats.map((chat) => (
          <ChatCard
            key={chat.id}
            chat={chat}
            onPress={() => {
              setSelectedChat(chat);
            }}
          />
        ))}

        <SectionHeader
          title="Community Highlights"
          subtitle="Discussion snippets"
        />
        <Text style={styles.snippet}>
          • Bulk fruit buyers looking for weekend live deals.
        </Text>
        <Text style={styles.snippet}>
          • Sellers discussing eco-friendly packaging alternatives.
        </Text>
        <Text style={styles.snippet}>
          • Local group poll: preferred delivery slots for weekdays.
        </Text>
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
  snippet: {
    fontSize: 13,
    color: "#4f6156",
    marginBottom: 6,
  },
});
