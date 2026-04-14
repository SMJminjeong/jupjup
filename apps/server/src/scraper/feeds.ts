import type { Category } from '@jupjup/types';

export interface FeedSource {
  url: string;
  category: Category;
  source: string;
  tags: string[];
}

export const RSS_FEEDS: FeedSource[] = [
  // AI 뉴스
  {
    url: 'https://www.aitimes.com/rss/allArticle.xml',
    category: 'ai_news',
    source: 'AI타임스',
    tags: ['LLM', '생성AI'],
  },
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'ai_news',
    source: 'TechCrunch AI',
    tags: ['AI', '연구'],
  },
  {
    url: 'https://news.google.com/rss/search?q=AI+artificial+intelligence&hl=ko&gl=KR&ceid=KR:ko',
    category: 'ai_news',
    source: 'Google News AI',
    tags: ['AI', '생성AI'],
  },

  // 채용 뉴스
  {
    url: 'https://news.google.com/rss/search?q=IT+developer+hiring+korea&hl=ko&gl=KR&ceid=KR:ko',
    category: 'job_news',
    source: 'Google News 채용',
    tags: ['IT', '채용'],
  },

  // 채용 공고 — RSS가 아닌 원티드/점핏 API로 수집 (jobs.ts)

  // 재테크
  {
    url: 'https://www.mk.co.kr/rss/30200030/',
    category: 'finance',
    source: '매일경제 증권',
    tags: ['주식', 'ETF'],
  },
  {
    url: 'https://news.google.com/rss/search?q=ETF+stock+investment+korea&hl=ko&gl=KR&ceid=KR:ko',
    category: 'finance',
    source: 'Google News 재테크',
    tags: ['재테크', '금융'],
  },
];
