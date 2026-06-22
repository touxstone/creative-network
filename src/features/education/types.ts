import type { LearningBookmark, LearningItem } from '@prisma/client';

export type LearningCatalogItem = LearningItem & {
  bookmarks: Array<Pick<LearningBookmark, 'id' | 'userId'>>;
  _count: {
    bookmarks: number;
  };
  isBookmarkedByViewer: boolean;
};

export type LearningDetail = LearningCatalogItem;

export interface LearningFilters {
  q?: string;
  language?: string;
  level?: string;
  discipline?: string;
}

export interface LearningFilterOptions {
  languages: string[];
  levels: string[];
  disciplines: string[];
}
