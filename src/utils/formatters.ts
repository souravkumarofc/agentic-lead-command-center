export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}k`;
  }
  return `$${amount}`;
}

export function formatTimeHHMMSS(date: Date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function formatRelativeTime(timestamp: string): string {
  // If already formatted like HH:mm:ss return as is
  if (/^\d{2}:\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }
  try {
    const d = new Date(timestamp);
    return formatTimeHHMMSS(d);
  } catch {
    return timestamp;
  }
}
