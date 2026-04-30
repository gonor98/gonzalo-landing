/**
 * Clamp an interpolation input range to [0,1] and guarantee
 * strictly monotonic increasing values (Framer Motion / WAAPI requirement).
 */
export function clampRange(values: number[]): number[] {
  const out: number[] = [];
  let prev = 0;
  for (let i = 0; i < values.length; i++) {
    let v = Math.min(1, Math.max(0, values[i]));
    if (i > 0 && v <= prev) v = Math.min(1, prev + 1e-4);
    out.push(v);
    prev = v;
  }
  return out;
}