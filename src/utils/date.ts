export const formatRelativeDate = (isoDate: string): string => {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - target;
  const dayMs = 24 * 60 * 60 * 1000;

  if (diffMs < dayMs) return 'Today';
  if (diffMs < dayMs * 2) return 'Yesterday';
  return `${Math.floor(diffMs / dayMs)} days ago`;
};

export const addDays = (isoDate: string, days: number): string => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const isDue = (isoDate: string): boolean => new Date(isoDate).getTime() <= Date.now();
