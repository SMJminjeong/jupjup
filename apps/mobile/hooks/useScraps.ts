import type { Category } from '@jupjup/types';
import { useCallback, useRef, useState } from 'react';
import { apiJson } from '@/lib/api';
import { mapScrap } from '@/lib/mappers';
import { useScrapStore } from '@/stores/scrapStore';

interface FetchOptions {
  category?: Category;
  search?: string;
  reset?: boolean;
}

export const useScraps = () => {
  const { setScraps, appendScraps } = useScrapStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  const fetchScraps = useCallback(
    async (opts: FetchOptions = {}) => {
      const isReset = opts.reset !== false;
      if (isReset) {
        setLoading(true);
        cursorRef.current = null;
        hasMoreRef.current = true;
      }

      try {
        const params = new URLSearchParams();
        if (opts.category) params.set('category', opts.category);
        if (opts.search) params.set('search', opts.search);
        if (!isReset && cursorRef.current) params.set('cursor', cursorRef.current);

        const qs = params.toString();
        const data = await apiJson<{ scraps: Record<string, unknown>[]; nextCursor: string | null }>(
          `/api/scraps${qs ? `?${qs}` : ''}`,
        );

        const mapped = data.scraps.map(mapScrap);
        cursorRef.current = data.nextCursor;
        hasMoreRef.current = data.nextCursor !== null;

        if (isReset) {
          setScraps(mapped);
        } else {
          appendScraps(mapped);
        }

        return mapped;
      } catch (err) {
        console.error('스크랩 목록 조회 실패:', err);
        return [];
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [setScraps, appendScraps],
  );

  const refresh = useCallback(
    async (opts?: Omit<FetchOptions, 'reset'>) => {
      setRefreshing(true);
      return fetchScraps({ ...opts, reset: true });
    },
    [fetchScraps],
  );

  const loadMore = useCallback(
    async (opts?: Omit<FetchOptions, 'reset'>) => {
      if (!hasMoreRef.current || loading) return;
      return fetchScraps({ ...opts, reset: false });
    },
    [fetchScraps, loading],
  );

  const toggleBookmark = useCallback(async (id: string) => {
    try {
      await apiJson(`/api/scraps/${id}/bookmark`, { method: 'POST' });
      useScrapStore.getState().toggleBookmark(id);
    } catch (err) {
      console.error('북마크 토글 실패:', err);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await apiJson(`/api/scraps/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: true }),
      });
      useScrapStore.getState().markRead(id);
    } catch (err) {
      console.error('읽음 처리 실패:', err);
    }
  }, []);

  const deleteScrap = useCallback(async (id: string) => {
    try {
      await apiJson(`/api/scraps/${id}`, { method: 'DELETE' });
      useScrapStore.getState().removeScrap(id);
    } catch (err) {
      console.error('스크랩 삭제 실패:', err);
    }
  }, []);

  return {
    loading,
    refreshing,
    hasMore: hasMoreRef.current,
    fetchScraps,
    refresh,
    loadMore,
    toggleBookmark,
    markRead,
    deleteScrap,
  };
};
