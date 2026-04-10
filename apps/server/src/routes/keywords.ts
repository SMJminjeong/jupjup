import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase.js';

const createKeywordBody = z.object({
  keyword: z.string().min(1).max(30),
  category: z.enum(['ai_news', 'job_news', 'job_post', 'finance'] as const),
});

export default async function keywordRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  /** GET /keywords — 내 키워드 목록 */
  app.get('/keywords', async (request) => {
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    const { data, error } = await db
      .from('user_keywords')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { keywords: data ?? [] };
  });

  /** POST /keywords — 키워드 추가 */
  app.post('/keywords', async (request, reply) => {
    const body = createKeywordBody.parse(request.body);
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    const { data, error } = await db
      .from('user_keywords')
      .insert({
        user_id: userId,
        keyword: body.keyword,
        category: body.category,
      })
      .select()
      .single();

    if (error) throw error;
    return { keyword: data };
  });

  /** DELETE /keywords/:id — 키워드 삭제 */
  app.delete<{ Params: { id: string } }>('/keywords/:id', async (request) => {
    const { id } = request.params;
    const userId = request.user!.userId;
    const db = supabaseAdmin();

    const { error } = await db
      .from('user_keywords')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  });
}
