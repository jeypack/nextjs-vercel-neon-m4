const DEFAULT_VISIBLE_DAY_COUNT = 4;

export function parseAnchorDate(value: string | string[] | undefined): Date {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate) {
    const [year, month, day] = candidate.split("-").map(Number);
    if (year && month && day) {
      const parsed = new Date(year, month - 1, day);
      parsed.setHours(0, 0, 0, 0);
      return parsed;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function parseVisibleDayCount(
  value: string | string[] | undefined,
): number {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);

  if (!Number.isInteger(parsed)) {
    return DEFAULT_VISIBLE_DAY_COUNT;
  }

  return Math.min(Math.max(parsed, 1), 14);
}

export function addDays(date: Date, offset: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

export function formatDateForQuery(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatRangeLabel(startDate: Date, endDate: Date): string {
  const start = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short",
  }).format(startDate);
  const end = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short",
  }).format(endDate);

  return `${start} – ${end}`;
}

export function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function parseDateInputToUtcDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

export function formatUtcDateForQuery(date: Date): string {
  return date.toISOString().slice(0, 10);
}
