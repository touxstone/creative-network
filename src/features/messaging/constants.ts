export const pinnedColorValues = ['rose', 'amber', 'teal', 'sky', 'violet'] as const;

export type PinnedColor = (typeof pinnedColorValues)[number];

export const pinnedColorLabels: Record<PinnedColor, string> = {
  rose: 'Rose',
  amber: 'Amber',
  teal: 'Teal',
  sky: 'Sky',
  violet: 'Violet',
};
