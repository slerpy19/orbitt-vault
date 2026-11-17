export function chartTime(timestamp: number, range: string, full = false): string {
  if (!Number.isFinite(timestamp)) return '';

  const date = new Date(timestamp);

  if (full) {
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  switch (range) {
    case 'LIVE':
    case '1D':
      return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
    case '1W':
      return date.toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    case '1M':
      return date.toLocaleString(undefined, { month: 'short', day: 'numeric' });
    case '1Y':
    case 'ALL':
      return date.toLocaleString(undefined, { month: 'short', year: '2-digit' });
    default:
      return date.toLocaleString(undefined, { month: 'short', day: 'numeric' });
  }
}

export const TIMEFRAMES = [
  { key: 'LIVE', label: 'Live', days: 1 },
  { key: '1D', label: '1D', days: 1 },
  { key: '1W', label: '1W', days: 7 },
  { key: '1M', label: '1M', days: 30 },
  { key: '1Y', label: '1Y', days: 365 },
  { key: 'ALL', label: 'All', days: 'max' },
] as const;

export type TimeframeKey = typeof TIMEFRAMES[number]['key'];