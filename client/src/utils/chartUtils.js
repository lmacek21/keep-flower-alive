// Splits a time series into "in range" / "out of range" segments based on
// min/max thresholds, inserting an interpolated point exactly at each
// threshold crossing so the two colored lines meet with no gap.
export function buildColoredSeries(points, min, max) {
  const inRange = (v) => (min == null || v >= min) && (max == null || v <= max);
  const result = [];

  points.forEach((cur, i) => {
    if (i > 0) {
      const prev = points[i - 1];
      const crossings = [];
      [min, max].forEach((th) => {
        if (th == null) return;
        const d1 = prev.value - th;
        const d2 = cur.value - th;
        if (d1 === 0 || d2 === 0 || d1 * d2 >= 0) return;
        crossings.push({ t: d1 / (d1 - d2), th });
      });
      crossings.sort((a, b) => a.t - b.t);
      crossings.forEach(({ t, th }) => {
        result.push({
          time: prev.time + t * (cur.time - prev.time),
          value: th,
          inRangeValue: th,
          outRangeValue: th,
        });
      });
    }
    const isInRange = inRange(cur.value);
    const touchesThreshold = cur.value === min || cur.value === max;
    result.push({
      ...cur,
      inRangeValue: isInRange ? cur.value : null,
      outRangeValue: !isInRange || touchesThreshold ? cur.value : null,
    });
  });

  return result;
}
