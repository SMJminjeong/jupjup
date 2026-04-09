import type { Category } from './scrap';

export interface UserKeyword {
  id: string;
  userId: string;
  keyword: string;
  category: Category;
  createdAt: string;
}
