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
    url: 'https://zdnet.co.kr/rss/ai.xml',
    category: 'ai_news',
    source: '지디넷코리아',
    tags: ['연구', '규제'],
  },

  // 채용 뉴스
  {
    url: 'https://www.jobkorea.co.kr/RSS/GoodNews',
    category: 'job_news',
    source: '잡코리아',
    tags: ['IT', '채용'],
  },

  // 재테크
  {
    url: 'https://www.mk.co.kr/rss/30200030/',
    category: 'finance',
    source: '매일경제 증권',
    tags: ['주식', 'ETF'],
  },
];
