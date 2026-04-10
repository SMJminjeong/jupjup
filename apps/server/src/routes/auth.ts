import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { signToken } from '../middleware/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

const kakaoLoginBody = z.object({
  accessToken: z.string().min(1),
});

export default async function authRoutes(app: FastifyInstance) {
  /** POST /auth/kakao — 카카오 액세스 토큰으로 로그인/회원가입 */
  app.post('/auth/kakao', async (request, reply) => {
    const body = kakaoLoginBody.safeParse(request.body);
    if (!body.success) {
      return reply.badRequest('accessToken이 필요합니다');
    }

    // 1. 카카오 API로 사용자 정보 조회
    const kakaoRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${body.data.accessToken}` },
    });

    if (!kakaoRes.ok) {
      return reply.unauthorized('카카오 토큰이 유효하지 않습니다');
    }

    const kakaoUser = (await kakaoRes.json()) as {
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

    // 2. DB upsert (회원가입 or 기존 유저 갱신)
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

    // 3. JWT 발급
    const token = signToken({ userId: user.id, kakaoId: user.kakao_id });

    return {
      token,
      user: { id: user.id, nickname, avatarUrl, email },
    };
  });

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
