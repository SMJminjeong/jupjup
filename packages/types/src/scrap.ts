export type Category = 'ai_news' | 'job_news' | 'job_post' | 'finance';

export const CATEGORY_LABEL: Record<Category, string> = {
  ai_news: 'AI 뉴스',
  job_news: '채용 뉴스',
  job_post: '채용 공고',
  finance: '재테크',
};

export interface Scrap {
  id: string;
  userId: string;
  category: Category;
  title: string;
  url: string;
  thumbnail?: string | null;
  summary?: string | null;
  source?: string | null;
  tags: string[];
  isRead: boolean;
  isBookmarked: boolean;
  deadlineAt?: string | null;
  memo?: string | null;
  createdAt: string;
}

export interface JobPostMeta {
  company: string;
  position: string;
  career?: string;
  techStack: string[];
  location?: string;
}
