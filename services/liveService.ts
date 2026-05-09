/**
 * liveService.ts — Operations for live selling sessions
 * startLive, endLive, getActiveSessions, updateViewers, subscribe
 */

import { supabase } from '../lib/supabase';
import type { LiveSession } from '../data/liveSessions';

function dbRowToLiveSession(row: any): LiveSession {
  return {
    id: row.id,
    hostName: row.host_name,
    title: row.title,
    viewers: row.viewers ?? 0,
    coverImage: row.cover_image ?? 'https://via.placeholder.com/400x240',
    locality: row.locality,
  };
}

/** Fetch all active live sessions */
export async function getActiveLiveSessions(): Promise<LiveSession[]> {
  const { data, error } = await supabase
    .from('live_sessions')
    .select('*')
    .eq('is_active', true)
    .order('viewers', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToLiveSession);
}

/** Start a new live session */
export async function startLiveSession(params: {
  hostId: string;
  hostName: string;
  title: string;
  locality: string;
  productId?: string;
}): Promise<LiveSession & { sessionId: string }> {
  const { data, error } = await supabase
    .from('live_sessions')
    .insert({
      host_id: params.hostId,
      host_name: params.hostName,
      title: params.title,
      locality: params.locality,
      product_id: params.productId ?? null,
      is_active: true,
      viewers: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...dbRowToLiveSession(data), sessionId: data.id };
}

/** End live session */
export async function endLiveSession(sessionId: string, hostId: string): Promise<void> {
  const { error } = await supabase
    .from('live_sessions')
    .update({ is_active: false, ended_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('host_id', hostId);

  if (error) throw error;
}

/** Update viewer count (join/leave) */
export async function updateViewerCount(
  sessionId: string,
  delta: 1 | -1
): Promise<void> {
  const { data } = await supabase
    .from('live_sessions')
    .select('viewers')
    .eq('id', sessionId)
    .single();

  const newCount = Math.max(0, (data?.viewers ?? 0) + delta);
  await supabase
    .from('live_sessions')
    .update({ viewers: newCount })
    .eq('id', sessionId);
}

/** Update the featured product of a live session */
export async function updateLiveProduct(
  sessionId: string,
  hostId: string,
  productId: string
): Promise<void> {
  const { error } = await supabase
    .from('live_sessions')
    .update({ product_id: productId })
    .eq('id', sessionId)
    .eq('host_id', hostId);

  if (error) throw error;
}

/** Subscribe for real-time live sessions updates */
export function subscribeToLiveSessions(
  callback: (sessions: LiveSession[]) => void
) {
  const channel = supabase
    .channel('live-sessions-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'live_sessions' },
      async () => {
        const updated = await getActiveLiveSessions();
        callback(updated);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
