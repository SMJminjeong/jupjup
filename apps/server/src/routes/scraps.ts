import type { Category } from '@jupjup/types';
import type { FastifyInstance } from 'fastify';
import ogs from 'open-graph-scraper';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase.js';

const createScrapBody = z.object({
  url: z.string().url(),
  category: z.enum(['ai_news', 'job_news', 'job_post', 'finance'] as const),
  memo: z.string().optional(),
  deadlineAt: z.string().datetime().optional(),
});

const listQuery = z.object({
  category: z.enum(['ai_news', 'job_news', 'job_post', 'finance'] as const).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
});

export default async function scrapRoutes(app: FastifyInstance) {
  // 모든 스크랩 라우트에 인증 필요
  app.addHook('preHandler', app.authenticate);

  /** GET /scraps — 목록 (페이지네이션) */
  app.get('/scraps', async (request) => {
    const query = listQuery.parse(request.query);
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    // 내 스크랩 + 공용 RSS 풀 (user_id IS NULL) 모두 조회
    let q = db
      .from('scraps')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(query.limit);

    if (query.category) {
      q = q.eq('category', query.category);
    }
    if (query.cursor) {
      q = q.lt('created_at', query.cursor);
    }
    if (query.search) {
      q = q.or(`title.ilike.%${query.search}%,summary.ilike.%${query.search}%`);
    }

    const { data, error } = await q;
    if (error) throw error;

    return {
      scraps: data ?? [],
      nextCursor: data?.length === query.limit ? data[data.length - 1].created_at : null,
    };
  });

  /** POST /scraps — 수동 URL 저장 */
  app.post('/scraps', async (request, reply) => {
    const body = createScrapBody.parse(request.body);
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    // OG 메타데이터 파싱
    let ogTitle = body.url;
    let ogSummary: string | null = null;
    let ogThumbnail: string | null = null;
    let ogSource: string | null = null;
    try {
      const { result } = await ogs({ url: body.url, timeout: 8000 });
      ogTitle = result.ogTitle ?? result.dcTitle ?? body.url;
      ogSummary = result.ogDescription ?? result.dcDescription ?? null;
      ogThumbnail = result.ogImage?.[0]?.url ?? null;
      ogSource = result.ogSiteName ?? null;
    } catch {
      app.log.warn(`OG 파싱 실패 (무시): ${body.url}`);
    }

    const { data, error } = await db
      .from('scraps')
      .insert({
        user_id: userId,
        url: body.url,
        category: body.category,
        memo: body.memo ?? null,
        deadline_at: body.deadlineAt ?? null,
        title: ogTitle,
        summary: ogSummary,
        thumbnail: ogThumbnail,
        source: ogSource,
        tags: [],
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return reply.conflict('이미 저장된 URL입니다');
      }
      throw error;
    }

    return { scrap: data };
  });

  /** PATCH /scraps/:id — 수정 (메모, 북마크, 읽음) */
  app.patch<{ Params: { id: string } }>('/scraps/:id', async (request) => {
    const { id } = request.params;
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    const updates = request.body as Record<string, unknown>;
    const allowed = ['memo', 'is_read', 'is_bookmarked'];
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k)),
    );

    const { data, error } = await db
      .from('scraps')
      .update(filtered)
      .eq('id', id)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { scrap: data };
  });

  /** DELETE /scraps/:id */
  app.delete<{ Params: { id: string } }>('/scraps/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    const { error } = await db
      .from('scraps')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  });

  /** POST /scraps/:id/bookmark — 북마크 토글 */
  app.post<{ Params: { id: string } }>('/scraps/:id/bookmark', async (request) => {
    const { id } = request.params;
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    // 현재 상태 조회 후 반전
    const { data: current } = await db
      .from('scraps')
      .select('is_bookmarked')
      .eq('id', id)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .maybeSingle();

    const { data, error } = await db
      .from('scraps')
      .update({ is_bookmarked: !current?.is_bookmarked })
      .eq('id', id)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { scrap: data };
  });
}
