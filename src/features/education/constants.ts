export const learningFormats = ['Class', 'Workshop', 'Webinar', 'Roundtable'] as const;

export const learningLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const learningStatusLabels: Record<string, string> = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
};
