/**
 * liveChatService.ts — Real-time chat for live streaming sessions
 * Supports send, fetch, and subscribe for live_chat_messages table
 */

import { supabase } from '../lib/supabase';

export type LiveChatMessage = {
  id: string;
  channelName: string;   // matches the Agora channel, e.g. "localbaazar_live"
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
};

/** Send a chat message to the live channel */
export async function sendLiveChatMessage(params: {
  channelName: string;
  senderId: string;
  senderName: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase
    .from('live_chat_messages')
    .insert({
      channel_name: params.channelName,
      sender_id: params.senderId,
      sender_name: params.senderName,
      message: params.message,
    });

  if (error) throw error;
}

/** Fetch the most recent messages for a live channel (last 50) */
export async function getRecentLiveChatMessages(
  channelName: string
): Promise<LiveChatMessage[]> {
  const { data, error } = await supabase
    .from('live_chat_messages')
    .select('*')
    .eq('channel_name', channelName)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data ?? [])
    .reverse()
    .map((row) => ({
      id: row.id,
      channelName: row.channel_name,
      senderId: row.sender_id,
      senderName: row.sender_name,
      message: row.message,
      createdAt: row.created_at,
    }));
}

/** Subscribe to new messages in real-time */
export function subscribeToLiveChat(
  channelName: string,
  callback: (msg: LiveChatMessage) => void
): () => void {
  const channel = supabase
    .channel(`live-chat-${channelName}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'live_chat_messages',
        filter: `channel_name=eq.${channelName}`,
      },
      (payload) => {
        const row = payload.new;
        callback({
          id: row.id,
          channelName: row.channel_name,
          senderId: row.sender_id,
          senderName: row.sender_name,
          message: row.message,
          createdAt: row.created_at,
        });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
