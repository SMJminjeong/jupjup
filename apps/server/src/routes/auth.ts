import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { env } from '../lib/env.js';
import { signToken } from '../middleware/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

export default async function authRoutes(app: FastifyInstance) {
  /**
   * GET /auth/kakao/callback
   * 카카오에서 redirect 받는 콜백 엔드포인트.
   * code를 토큰으로 교환 → 유저 upsert → JWT 발급 → 앱으로 deep link redirect
   */
  app.get('/auth/kakao/callback', async (request, reply) => {
    const { code, state } = request.query as {
      code?: string;
      state?: string;
    };

    if (!code) {
      return reply.badRequest('code가 필요합니다');
    }

    // state에 앱의 return URL이 담겨있음
    const appReturnUrl = state ? decodeURIComponent(state) : null;

    try {
      const redirectUri = `${env().SERVER_URL}/api/auth/kakao/callback`;
      app.log.info(`카카오 토큰 교환 redirectUri: ${redirectUri}`);

      // 1. Authorization code → Access token 교환
      const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: env().KAKAO_REST_API_KEY,
          client_secret: env().KAKAO_CLIENT_SECRET,
          redirect_uri: redirectUri,
          code,
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        app.log.error(`카카오 토큰 교환 실패: ${err}`);
        return reply.unauthorized('카카오 인증 실패');
      }

      const tokenData = (await tokenRes.json()) as { access_token: string };

      // 2. Access token으로 사용자 정보 조회
      const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userRes.ok) {
        return reply.unauthorized('카카오 사용자 정보 조회 실패');
      }

      const kakaoUser = (await userRes.json()) as {
        id: number;
        kakao_account?: {
          profile?: { nickname?: string; profile_image_url?: string };
          email?: string;
        };
      };

      const profile = kakaoUser.kakao_account?.profile;
      const nickname = profile?.nickname ?? '사용자';
      const avatarUrl = profile?.profile_image_url ?? null;
      const email = kakaoUser.kakao_account?.email ?? null;

      // 3. DB upsert
      const db = supabaseAdmin();
      const { data: user, error } = await db
        .from('users')
        .upsert(
          {
            kakao_id: kakaoUser.id,
            nickname,
            avatar_url: avatarUrl,
            email,
          },
          { onConflict: 'kakao_id' },
        )
        .select('id, kakao_id')
        .single();

      if (error || !user) {
        app.log.error(error, '유저 upsert 실패');
        return reply.internalServerError('유저 생성 실패');
      }

      // 4. JWT 발급
      const token = signToken({ userId: user.id, kakaoId: user.kakao_id });

      // 5. 앱으로 redirect (deep link)
      if (appReturnUrl) {
        const sep = appReturnUrl.includes('?') ? '&' : '?';
        const deepLink = `${appReturnUrl}${sep}token=${token}&nickname=${encodeURIComponent(nickname)}&userId=${user.id}&kakaoId=${user.kakao_id}&avatarUrl=${encodeURIComponent(avatarUrl ?? '')}`;
        return reply.redirect(deepLink);
      }

      // fallback: JSON 응답
      return {
        token,
        user: {
          id: user.id,
          kakaoId: user.kakao_id,
          nickname,
          avatarUrl,
          email,
        },
      };
    } catch (err) {
      app.log.error(err, '카카오 로그인 처리 실패');
      return reply.internalServerError('로그인 처리 실패');
    }
  });

  /** GET /auth/me — 내 정보 조회 */
  app.get(
    '/auth/me',
    { preHandler: app.authenticate },
    async (request, reply) => {
      const db = supabaseAdmin();
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('id', request.user!.userId)
        .single();

      if (error || !data) {
        return reply.notFound('유저를 찾을 수 없습니다');
      }

      return {
        user: {
          id: data.id,
          kakaoId: data.kakao_id,
          nickname: data.nickname,
          avatarUrl: data.avatar_url,
          email: data.email,
        },
      };
    },
  );

  /** DELETE /auth/me — 계정 탈퇴 */
  app.delete(
    '/auth/me',
    { preHandler: app.authenticate },
    async (request, reply) => {
      const db = supabaseAdmin();
      const { error } = await db
        .from('users')
        .delete()
        .eq('id', request.user!.userId);

      if (error) {
        return reply.internalServerError('계정 삭제 실패');
      }
      return { success: true };
    },
  );
}
