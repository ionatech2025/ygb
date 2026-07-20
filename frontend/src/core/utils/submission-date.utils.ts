/** Local calendar day key (YYYY-MM-DD) for the given instant. */
export function localDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return localDayKey(a) === localDayKey(b);
}

export function isCreatedToday(createdAtIso: string, now: Date = new Date()): boolean {
  return isSameLocalDay(new Date(createdAtIso), now);
}

export function countCreatedToday(createdAtValues: string[], now: Date = new Date()): number {
  return createdAtValues.filter((value) => isCreatedToday(value, now)).length;
}
