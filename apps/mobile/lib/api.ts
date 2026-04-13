import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:4000';

const TOKEN_KEY = 'jupjup_token';

/** SecureStore에서 토큰 관리 */
export const tokenStore = {
  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  remove: () => SecureStore.deleteItemAsync(TOKEN_KEY),
};

/** 인증 헤더 포함 fetch 래퍼 */
export const apiFetch = async (
  path: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = await tokenStore.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
};

/** JSON 응답 파싱 + 에러 핸들링 */
export const apiJson = async <T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const res = await apiFetch(path, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? `API 에러 (${res.status})`);
  }

  return data as T;
};
