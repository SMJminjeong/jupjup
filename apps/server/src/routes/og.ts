import type { FastifyInstance } from 'fastify';
import ogs from 'open-graph-scraper';
import { z } from 'zod';

const ogQuery = z.object({
  url: z.string().url(),
});

export default async function ogRoutes(app: FastifyInstance) {
  /** GET /og?url=... — URL의 OG 메타데이터 반환 */
  app.get('/og', async (request, reply) => {
    const query = ogQuery.safeParse(request.query);
    if (!query.success) {
      return reply.badRequest('유효한 URL을 입력하세요');
    }

    try {
      const { result } = await ogs({ url: query.data.url, timeout: 8000 });

      return {
        title: result.ogTitle ?? result.dcTitle ?? null,
        description: result.ogDescription ?? result.dcDescription ?? null,
        image: result.ogImage?.[0]?.url ?? null,
        siteName: result.ogSiteName ?? null,
        url: result.ogUrl ?? query.data.url,
      };
    } catch {
      return reply.badGateway('메타데이터를 불러올 수 없습니다');
    }
  });
}
