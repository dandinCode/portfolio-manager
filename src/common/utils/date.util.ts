export function toISODate(date: string | Date): string | null {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

export function oneYearRange() {
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

