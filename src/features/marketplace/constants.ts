export const serviceCategories = [
  'Writing',
  'Script notes',
  'Casting',
  'Production',
  'Music',
  'Editing',
  'Coaching',
] as const;

export const deliveryModes = ['REMOTE', 'LOCAL', 'HYBRID'] as const;

export const serviceStatuses = ['ACTIVE', 'PAUSED'] as const;

export const deliveryModeLabels: Record<(typeof deliveryModes)[number], string> = {
  REMOTE: 'Remote',
  LOCAL: 'Local',
  HYBRID: 'Hybrid',
};

export const serviceStatusLabels: Record<(typeof serviceStatuses)[number], string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
};
