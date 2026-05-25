export function parsePositiveIntParam(value: string | null | undefined, fallback = 1): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}
