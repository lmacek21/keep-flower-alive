import { useState } from "react";
import Modal from "./Modal";

const RANGE_OPTIONS = [
  { label: "1h", ms: 1 * 60 * 60 * 1000 },
  { label: "12h", ms: 12 * 60 * 60 * 1000 },
  { label: "24h", ms: 24 * 60 * 60 * 1000 },
  { label: "3 days", ms: 3 * 24 * 60 * 60 * 1000 },
  { label: "7 days", ms: 7 * 24 * 60 * 60 * 1000 },
];

export default function RangeSelector({ onChange }) {
  const [rangeLabel, setRangeLabel] = useState("24h");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [customError, setCustomError] = useState(null);

  function selectPreset(label) {
    const opt = RANGE_OPTIONS.find((r) => r.label === label);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - opt.ms);
    setRangeLabel(label);
    onChange(startDate, endDate, label, null);
  }

  function handleApplyCustom() {
    if (!customStart || !customEnd) {
      setCustomError("Please select both start and end time.");
      return;
    }
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (start >= end) {
      setCustomError("Start must be before end.");
      return;
    }
    setCustomError(null);
    setRangeLabel("Custom");
    setShowCustomModal(false);
    onChange(start, end, "Custom", { start, end });
  }

  return (
    <>
      <div className="btn-group" role="group">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r.label}
            type="button"
            className={`btn btn-sm ${rangeLabel === r.label ? "btn-app" : "btn-outline-secondary"}`}
            onClick={() => selectPreset(r.label)}
          >
            {r.label}
          </button>
        ))}
        <button
          type="button"
          className={`btn btn-sm ${rangeLabel === "Custom" ? "btn-app" : "btn-outline-secondary"}`}
          onClick={() => setShowCustomModal(true)}
        >
          Custom
        </button>
      </div>

      {showCustomModal && (
        <Modal title="Custom range" onClose={() => setShowCustomModal(false)}>
          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label className="form-label">From</label>
              <input
                type="datetime-local"
                className="form-control"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">To</label>
              <input
                type="datetime-local"
                className="form-control"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
            {customError && (
              <div className="alert alert-danger py-2 mb-0">{customError}</div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCustomModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-app"
              onClick={handleApplyCustom}
            >
              Apply
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
