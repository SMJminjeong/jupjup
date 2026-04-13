import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Auth
  SERVER_URL: z.string().url().default('http://localhost:4000'),
  KAKAO_REST_API_KEY: z.string().min(1),
  KAKAO_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(16),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export const loadEnv = (): Env => {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ 환경변수 검증 실패:', parsed.error.flatten().fieldErrors);
    // 개발 환경에서는 기본값으로 진행 (Supabase/Kakao 연동 전)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  개발 모드: 기본값으로 서버 시작');
      _env = {
        PORT: Number(process.env.PORT) || 4000,
        NODE_ENV: 'development',
        SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'placeholder',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
        KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY || 'placeholder',
        KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET || 'placeholder',
        SERVER_URL: process.env.SERVER_URL || 'http://localhost:4000',
        JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-minimum-16',
      };
      return _env;
    }
    process.exit(1);
  }
  _env = parsed.data;
  return _env;
};

export const env = (): Env => {
  if (!_env) throw new Error('loadEnv()를 먼저 호출하세요');
  return _env;
};
