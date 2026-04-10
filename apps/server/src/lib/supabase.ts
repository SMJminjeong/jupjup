import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let _client: SupabaseClient | null = null;

/** 서비스 역할 키를 사용하는 관리자 클라이언트 (RLS 우회) */
export const supabaseAdmin = (): SupabaseClient => {
  if (_client) return _client;
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env();
  _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return _client;
};
