export const MAX_PARTY_SIZE = 10;

export function parseCountInput(
  value: FormDataEntryValue | null,
  { min, max }: { min: number; max: number },
) {
  const parsed = typeof value === "string" ? parseInt(value, 10) : NaN;
  if (Number.isNaN(parsed)) {
    return min;
  }
  return Math.min(max, Math.max(min, parsed));
}
