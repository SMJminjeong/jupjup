import Parser from 'rss-parser';
import type { FeedSource } from './feeds.js';
import { supabaseAdmin } from '../lib/supabase.js';

const rss = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'JupJup-RSS-Bot/1.0' },
});

export interface ParsedArticle {
  title: string;
  url: string;
  summary: string | null;
  thumbnail: string | null;
  source: string;
  category: string;
  tags: string[];
  publishedAt: string | null;
}

/** 단일 피드 수집 → DB 저장 */
export const collectFeed = async (feed: FeedSource): Promise<number> => {
  try {
    const result = await rss.parseURL(feed.url);
    const db = supabaseAdmin();
    let inserted = 0;

    for (const item of result.items.slice(0, 20)) {
      if (!item.link) continue;

      const article: Record<string, unknown> = {
        title: item.title ?? '제목 없음',
        url: item.link,
        summary: item.contentSnippet?.slice(0, 200) ?? null,
        thumbnail: item.enclosure?.url ?? null,
        source: feed.source,
        category: feed.category,
        tags: feed.tags,
        is_read: false,
        is_bookmarked: false,
        created_at: item.isoDate ?? new Date().toISOString(),
      };

      // URL 중복 무시 (upsert)
      const { error } = await db
        .from('scraps')
        .upsert(article, { onConflict: 'url', ignoreDuplicates: true });

      if (!error) inserted++;
    }

    return inserted;
  } catch (err) {
    console.error(`[RSS] ${feed.source} 수집 실패:`, err);
    return 0;
  }
};
