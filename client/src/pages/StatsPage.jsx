import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import RangeSelector from "../components/RangeSelector";
import FlowerSelector from "../components/FlowerSelector";
import MeasurementChart from "../components/MeasurementChart";

export default function StatsPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [room, setRoom] = useState(location.state?.room ?? null);
  const [roomError, setRoomError] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [range, setRange] = useState(() => {
    const end = new Date();
    return {
      startDate: new Date(end - 24 * 60 * 60 * 1000),
      endDate: end,
      label: "24h",
      customRange: null,
    };
  });

  function handleRangeChange(startDate, endDate, label, customRange) {
    setRange({ startDate, endDate, label, customRange });
  }

  function toggleFlower(id) {
    setSelectedFlowerId((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    async function loadRoom() {
      try {
        const data = await api.get("/room/load", { id: roomId });
        setRoom(data);
      } catch (err) {
        setRoomError(err.message);
      }
    }
    loadRoom();
  }, [roomId]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get("/measurement/list", {
          roomId,
          startDate: range.startDate.toISOString(),
          endDate: range.endDate.toISOString(),
        });
        setMeasurements(
          [...data].sort(
            (a, b) => new Date(a.measuredAt) - new Date(b.measuredAt),
          ),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [roomId, range]);

  if (!room) {
    if (roomError) {
      return (
        <div className="p-4">
          <p className="text-muted">Error: {roomError}</p>
          <button className="btn btn-app" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      );
    }
    return <p className="p-4">Loading…</p>;
  }

  const unit = measurements[0]?.unit ?? "";
  const selectedFlowers = room.flowers.filter(
    (f) => f._id === selectedFlowerId,
  );
  const queriedRange = {
    start: range.startDate.getTime(),
    end: range.endDate.getTime(),
  };
  const chartTitle =
    range.label === "Custom" && range.customRange
      ? `Measurements: ${range.customRange.start.toLocaleString()} – ${range.customRange.end.toLocaleString()}`
      : `Measurements: last ${range.label}`;

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-app-outline btn-sm"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <h1 className="mb-0" style={{ color: "var(--c-dark-green)" }}>
            {room.name} — Stats
          </h1>
        </div>
        <RangeSelector onChange={handleRangeChange} />
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <FlowerSelector
            flowers={room.flowers}
            selectedFlowerId={selectedFlowerId}
            onToggle={toggleFlower}
          />
        </div>
        <div className="col-md-8">
          <MeasurementChart
            title={chartTitle}
            measurements={measurements}
            selectedFlowers={selectedFlowers}
            loading={loading}
            error={error}
            unit={unit}
            queriedRange={queriedRange}
          />
        </div>
      </div>
    </div>
  );
}
