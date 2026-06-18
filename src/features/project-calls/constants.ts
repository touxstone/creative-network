export const callStatusValues = ['OPEN', 'PAUSED', 'CLOSED'] as const;

export const callStatusLabels: Record<(typeof callStatusValues)[number], string> = {
  OPEN: 'Open',
  PAUSED: 'Paused',
  CLOSED: 'Closed',
};

export const applicationStatusLabels: Record<string, string> = {
  SUBMITTED: 'Submitted',
  SHORTLISTED: 'Shortlisted',
  DECLINED: 'Declined',
};
