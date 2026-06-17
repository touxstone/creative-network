export const projectStatusValues = [
  'DEVELOPMENT',
  'PRE_PRODUCTION',
  'PRODUCTION',
  'POST',
  'SEEKING_COLLABORATORS',
] as const;

export const projectStatusLabels: Record<(typeof projectStatusValues)[number], string> = {
  DEVELOPMENT: 'Development',
  PRE_PRODUCTION: 'Pre-production',
  PRODUCTION: 'Production',
  POST: 'Post-production',
  SEEKING_COLLABORATORS: 'Seeking collaborators',
};
