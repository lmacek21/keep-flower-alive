import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildColoredSeries } from "../utils/chartUtils";

function makeTooltip(unit) {
  return function ({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) return null;
    const entry =
      payload.find((p) => p.dataKey === "outRangeValue" && p.value != null) ??
      payload.find((p) => p.dataKey === "inRangeValue" && p.value != null) ??
      payload.find((p) => p.dataKey === "value" && p.value != null);
    if (!entry) return null;
    const isOut = entry.dataKey === "outRangeValue";
    return (
      <div
        className="p-2 rounded shadow-sm"
        style={{ backgroundColor: "var(--c-white)", border: "1px solid #ddd" }}
      >
        <div style={{ fontSize: "0.75rem", color: "#666" }}>
          {new Date(label).toLocaleString()}
        </div>
        <div style={{ fontWeight: 600, color: isOut ? "#dc3545" : "#2E8050" }}>
          Value: {entry.value} °{unit}
        </div>
      </div>
    );
  };
}

export default function MeasurementChart({
  title,
  measurements,
  selectedFlowers,
  loading,
  error,
  unit,
  queriedRange,
}) {
  let effectiveMin = null;
  let effectiveMax = null;
  selectedFlowers.forEach((f) => {
    if (f.minTemp != null)
      effectiveMin =
        effectiveMin == null ? f.minTemp : Math.max(effectiveMin, f.minTemp);
    if (f.maxTemp != null)
      effectiveMax =
        effectiveMax == null ? f.maxTemp : Math.min(effectiveMax, f.maxTemp);
  });

  const timedMeasurements = measurements.map((m) => ({
    ...m,
    time: new Date(m.measuredAt).getTime(),
  }));
  const chartData =
    selectedFlowers.length > 0
      ? buildColoredSeries(timedMeasurements, effectiveMin, effectiveMax)
      : timedMeasurements;

  return (
    <div className="card shadow-sm h-100">
      <div
        className="card-header fw-semibold"
        style={{
          backgroundColor: "var(--c-dark-green)",
          color: "var(--c-white)",
        }}
      >
        {title}
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {loading ? (
          <p className="text-muted mb-0">Loading…</p>
        ) : measurements.length === 0 ? (
          <p className="text-muted mb-0">
            No measurements recorded in this period.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#F2F8EF" />
              <XAxis
                dataKey="time"
                type="number"
                domain={
                  queriedRange
                    ? [queriedRange.start, queriedRange.end]
                    : ["dataMin", "dataMax"]
                }
                tickFormatter={(t) =>
                  new Date(t).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <YAxis unit={unit ? ` ${unit}` : ""} />
              <Tooltip content={makeTooltip(unit)} />
              {selectedFlowers.length > 0 ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="inRangeValue"
                    stroke="#2E8050"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="outRangeValue"
                    stroke="#dc3545"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2E8050"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {selectedFlowers.flatMap((f) => [
                f.minTemp != null && (
                  <ReferenceLine
                    key={`${f._id}-min`}
                    y={f.minTemp}
                    stroke="#dc3545"
                    strokeDasharray="4 4"
                    label={{
                      value: `${f.name} min`,
                      position: "insideBottomLeft",
                      fontSize: 10,
                    }}
                  />
                ),
                f.maxTemp != null && (
                  <ReferenceLine
                    key={`${f._id}-max`}
                    y={f.maxTemp}
                    stroke="#dc3545"
                    strokeDasharray="4 4"
                    label={{
                      value: `${f.name} max`,
                      position: "insideTopLeft",
                      fontSize: 10,
                    }}
                  />
                ),
              ])}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
