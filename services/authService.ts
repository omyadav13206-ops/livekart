/**
 * authService.ts — All authentication functions
 * Signup, Login, Logout, getCurrentUser, updateProfile
 */

import { supabase } from '../lib/supabase';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpData = AuthCredentials & {
  name: string;
  locality?: string;
};

/** Create new account */
export async function signUp({ email, password, name, locality }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, locality },
    },
  });

  if (error) throw error;

  return data;
}

/** Login with email & password */
export async function signIn({ email, password }: AuthCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/** Logout */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get currently logged-in user */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/** Listen for auth state changes */
export function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    }
  );
  return subscription;
}

/** Fetch own profile */
export async function getMyProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/** Update profile */
export async function updateProfile(
  userId: string,
  updates: { name?: string; avatar_url?: string; locality?: string }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
