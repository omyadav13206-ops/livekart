/**
 * imageService.ts — Upload/delete product images to Supabase Storage
 * Bucket name: product-images (must be a public bucket)
 * 
 * Android fix: fetch(localUri) does not work on Android for local file URIs.
 * Using FormData + REST API approach which works on both Android and iOS.
 */

import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

const BUCKET = 'product-images';

/** Pick an image from the gallery */
export async function pickProductImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

/** Take a photo using the camera */
export async function captureProductImage(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

/**
 * Upload a local URI to Supabase Storage and return the public URL.
 * Uses FormData — works on Android and iOS.
 */
export async function uploadProductImage(
  localUri: string,
  sellerId: string
): Promise<string> {
  // Get file extension from URI
  const uriParts = localUri.split('.');
  const ext = uriParts[uriParts.length - 1]?.toLowerCase() ?? 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  const fileName = `${sellerId}/${Date.now()}.${ext}`;

  // Build FormData — Android handles local file URIs this way
  const formData = new FormData();
  formData.append('file', {
    uri: localUri,
    name: fileName,
    type: mimeType,
  } as any);

  // Get Supabase session token
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase URL or Anon Key is missing');
  }

  // Call Supabase Storage REST API directly
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${BUCKET}/${fileName}`;
  const authHeader = token ? `Bearer ${token}` : `Bearer ${anonKey}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'apikey': anonKey,
      // Do NOT set Content-Type — fetch sets it automatically for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} — ${errorText}`);
  }

  // Build and return public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;
  return publicUrl;
}

/** Delete an image from storage (optional cleanup) */
export async function deleteProductImage(publicUrl: string): Promise<void> {
  const parts = publicUrl.split(`/${BUCKET}/`);
  if (parts.length < 2) return;
  const filePath = parts[1];
  await supabase.storage.from(BUCKET).remove([filePath]);
}
