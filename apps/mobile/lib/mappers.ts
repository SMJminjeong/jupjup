import type { Scrap } from '@jupjup/types';

/** DB snake_case → 클라이언트 camelCase 변환 */
export const mapScrap = (row: Record<string, unknown>): Scrap => ({
  id: row.id as string,
  userId: row.user_id as string,
  category: row.category as Scrap['category'],
  title: row.title as string,
  url: row.url as string,
  thumbnail: (row.thumbnail as string) ?? null,
  summary: (row.summary as string) ?? null,
  source: (row.source as string) ?? null,
  tags: (row.tags as string[]) ?? [],
  isRead: row.is_read as boolean,
  isBookmarked: row.is_bookmarked as boolean,
  deadlineAt: (row.deadline_at as string) ?? null,
  memo: (row.memo as string) ?? null,
  createdAt: row.created_at as string,
});
