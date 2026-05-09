/**
 * chatService.ts — Operations for chat conversations and messages
 * getConversations, getMessages, sendMessage, real-time subscribe
 */

import { supabase } from '../lib/supabase';
import type { ChatPreview } from '../data/chats';

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

function dbRowToChatPreview(row: any, currentUserId: string): ChatPreview {
  const isParticipantOne = row.participant_one_id === currentUserId;
  return {
    id: row.id,
    personName: isParticipantOne
      ? (row.participant_two?.name ?? 'Unknown')
      : (row.participant_one?.name ?? 'Unknown'),
    personRole: 'buyer',
    lastMessage: row.last_message ?? '',
    time: row.last_message_at
      ? new Date(row.last_message_at).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
    unreadCount: row.unread_count ?? 0,
  };
}

/** Fetch all conversations for a user */
export async function getConversations(userId: string): Promise<ChatPreview[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_one:profiles!conversations_participant_one_id_fkey(name),
      participant_two:profiles!conversations_participant_two_id_fkey(name)
    `)
    .or(`participant_one_id.eq.${userId},participant_two_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => dbRowToChatPreview(row, userId));
}

/** Get or create conversation between two users */
export async function getOrCreateConversation(
  userId1: string,
  userId2: string
): Promise<string> {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(
      `and(participant_one_id.eq.${userId1},participant_two_id.eq.${userId2}),and(participant_one_id.eq.${userId2},participant_two_id.eq.${userId1})`
    )
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({ participant_one_id: userId1, participant_two_id: userId2 })
    .select('id')
    .single();

  if (error) throw error;
  return created.id;
}

/** Fetch all messages in a conversation */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

/** Send a message */
export async function sendMessage(params: {
  conversationId: string;
  senderId: string;
  content: string;
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.conversationId,
      sender_id: params.senderId,
      content: params.content,
    })
    .select()
    .single();

  if (error) throw error;

  // Update the last_message of the conversation
  await supabase
    .from('conversations')
    .update({
      last_message: params.content,
      last_message_at: new Date().toISOString(),
    })
    .eq('id', params.conversationId);

  return {
    id: data.id,
    conversationId: data.conversation_id,
    senderId: data.sender_id,
    content: data.content,
    isRead: data.is_read,
    createdAt: data.created_at,
  };
}

/** Mark messages as read */
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
}

/** Subscribe for real-time messages */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const row = payload.new;
        callback({
          id: row.id,
          conversationId: row.conversation_id,
          senderId: row.sender_id,
          content: row.content,
          isRead: row.is_read,
          createdAt: row.created_at,
        });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
