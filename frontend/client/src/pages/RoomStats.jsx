import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";
import NavBar from "../components/NavBar";

const HOUSE_ID_STORAGE_KEY = "HOUSE_ID";

function buttonStyle(active) {
    return {
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #ddd",
        background: active ? "#f2f7ff" : "#fff",
        cursor: "pointer"
    };
}

function extractMeasurementList(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];

    const candidates = [
        payload.itemList,
        payload.items,
        payload.list,
        payload.data,
        payload.measurements,
        payload.results
    ];

    for (const c of candidates) {
        if (Array.isArray(c)) return c;
    }
    return [];
}

function getMeasurementValue(m) {
    const raw = m?.value ?? m?.temperature ?? m?.temp ?? m?.measurementValue;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
}

function getMeasurementTime(m) {
    const direct = m?.createdAt || m?.timestamp || m?.time || m?.date;
    if (direct) return direct;
    const id = String(m?._id || "");
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
        const seconds = Number.parseInt(id.slice(0, 8), 16);
        if (Number.isFinite(seconds)) return new Date(seconds * 1000).toISOString();
    }
    return "";
}

export default function RoomStats() {
    const [house, setHouse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [view, setView] = useState("table"); // 'table' | 'graph'

    const [measurements, setMeasurements] = useState([]);
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
    const [measurementsError, setMeasurementsError] = useState(null);
    const [didAutoPickRoomWithData, setDidAutoPickRoomWithData] = useState(false);

    const loadHouse = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const id = window.localStorage.getItem(HOUSE_ID_STORAGE_KEY) || "";
            if (!id) {
                setHouse(null);
                setError("No house loaded");
                return;
            }
            const body = { id };
            console.log("REQUEST:", "/home/load", body);
            const res = await api.post("/home/load", body);
            console.log("RESPONSE:", res.data);
            setHouse(res.data);
            setDidAutoPickRoomWithData(false);
            if (!selectedRoomId && Array.isArray(res.data?.rooms) && res.data.rooms.length > 0) {
                setSelectedRoomId(res.data.rooms[0]._id);
            }
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setHouse(null);
            setError("Failed to load house");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            loadHouse();
        });
    }, []);

    const rooms = useMemo(() => {
        const list = Array.isArray(house?.rooms) ? house.rooms : [];
        return list
            .map((r) => ({
                ...r,
                _roomId: r?._id || r?.id || ""
            }))
            .filter((r) => r._roomId);
    }, [house]);

    useEffect(() => {
        if (rooms.length === 0) {
            if (selectedRoomId) {
                Promise.resolve().then(() => {
                    setSelectedRoomId("");
                });
            }
            return;
        }
        const exists = rooms.some((r) => r._roomId === selectedRoomId);
        if (!selectedRoomId || !exists) {
            Promise.resolve().then(() => {
                setSelectedRoomId(rooms[0]._roomId);
            });
        }
    }, [rooms, selectedRoomId]);

    const loadMeasurements = async (roomId) => {
        if (!roomId) {
            setMeasurements([]);
            setMeasurementsError(null);
            return;
        }
        try {
            setIsLoadingMeasurements(true);
            setMeasurementsError(null);
            const requestData = {
                roomId,
                startDate: "2000-01-01T00:00:00.000Z",
                endDate: new Date().toISOString()
            };
            console.log("REQUEST /measurement/list:", requestData);
            let res;
            try {
                res = await api.get("/measurement/list", { params: requestData });
            } catch (getErr) {
                console.log("GET /measurement/list failed, retrying POST:", getErr?.response?.data || getErr?.message);
                res = await api.post("/measurement/list", requestData);
            }

            console.log("RAW MEASUREMENT RESPONSE:", res.data);
            const rawList = extractMeasurementList(res.data);
            const list = rawList
                .map((m) => ({
                    ...m,
                    _parsedValue: getMeasurementValue(m),
                    _parsedTime: getMeasurementTime(m)
                }))
                .filter((m) => m._parsedValue !== null);

            console.log("PARSED MEASUREMENT LIST:", list, "count:", list.length, "roomId:", roomId);

            if (list.length === 0 && !didAutoPickRoomWithData && rooms.length > 1) {
                for (const room of rooms) {
                    if (room._roomId === roomId) continue;
                    try {
                        const altRequest = { ...requestData, roomId: room._roomId };
                        const altRes = await api.get("/measurement/list", { params: altRequest });
                        const altRawList = extractMeasurementList(altRes.data);
                        const altList = altRawList
                            .map((m) => ({
                                ...m,
                                _parsedValue: getMeasurementValue(m),
                                _parsedTime: getMeasurementTime(m)
                            }))
                            .filter((m) => m._parsedValue !== null);
                        if (altList.length > 0) {
                            console.log("AUTO SELECT ROOM WITH DATA:", room._roomId, "count:", altList.length);
                            setDidAutoPickRoomWithData(true);
                            setSelectedRoomId(room._roomId);
                            return;
                        }
                    } catch {
                        // ignore and continue checking next room
                    }
                }
                setDidAutoPickRoomWithData(true);
            }

            setMeasurements(list);
        } catch (err) {
            console.log("ERROR:", err?.response?.data);
            setMeasurements([]);
            setMeasurementsError("Failed to load measurements");
        } finally {
            setIsLoadingMeasurements(false);
        }
    };

    useEffect(() => {
        if (!selectedRoomId) {
            Promise.resolve().then(() => {
                setMeasurements([]);
                setMeasurementsError(null);
            });
            return;
        }
        loadMeasurements(selectedRoomId);
    }, [selectedRoomId]);

    useEffect(() => {
        const onMeasurementUpdated = (event) => {
            const roomId = event?.detail?.roomId;
            if (!selectedRoomId || (roomId && roomId !== selectedRoomId)) return;
            loadMeasurements(selectedRoomId);
        };
        window.addEventListener("measurement-updated", onMeasurementUpdated);
        return () => window.removeEventListener("measurement-updated", onMeasurementUpdated);
    }, [selectedRoomId]);

    const chartData = useMemo(() => {
        const list = Array.isArray(measurements) ? measurements : [];
        return list
            .map((m, i) => {
                const v = getMeasurementValue(m);
                const createdAtRaw = getMeasurementTime(m);
                const createdAt = createdAtRaw ? new Date(createdAtRaw).toLocaleString() : `#${i + 1}`;
                return {
                    createdAt,
                    value: Number.isFinite(v) ? v : null
                };
            })
            .filter((p) => p.value !== null);
    }, [measurements]);

    return (
        <div style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
            <NavBar />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>Room Stats</h2>
                <button type="button" onClick={loadHouse} style={buttonStyle(false)}>
                    Refresh
                </button>
            </div>

            {isLoading ? (
                <div style={{ marginTop: 16 }}>Loading...</div>
            ) : error ? (
                <div style={{ marginTop: 16, color: "#b00020" }}>{error}</div>
            ) : !house ? (
                <div style={{ marginTop: 16, color: "#b00020" }}>No house loaded</div>
            ) : (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div
                        style={{
                            border: "1px solid #eee",
                            borderRadius: 10,
                            padding: 12,
                            background: "#fafafa"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                            <div style={{ fontWeight: 700 }}>Room</div>
                            <select
                                value={selectedRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    minWidth: 260
                                }}
                            >
                                <option value="">Select a room</option>
                                {rooms.map((r) => (
                                    <option key={r._roomId} value={r._roomId}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
                        <button type="button" onClick={() => setView("table")} style={buttonStyle(view === "table")}>
                            Table view
                        </button>
                        <button type="button" onClick={() => setView("graph")} style={buttonStyle(view === "graph")}>
                            Graph view
                        </button>
                    </div>

                    {!selectedRoomId ? (
                        <div style={{ color: "#666" }}>Select a room to see measurements.</div>
                    ) : isLoadingMeasurements ? (
                        <div>Loading measurements...</div>
                    ) : measurementsError ? (
                        <div style={{ color: "#b00020" }}>{measurementsError}</div>
                    ) : view === "table" ? (
                        <div
                            style={{
                                border: "1px solid #eee",
                                borderRadius: 10,
                                overflow: "hidden",
                                background: "#fff"
                            }}
                        >
                            <div style={{ padding: 10, fontWeight: 700, borderBottom: "1px solid #eee" }}>
                                Measurements
                            </div>
                            <div style={{ width: "100%", overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#fafafa" }}>
                                            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>
                                                Time
                                            </th>
                                            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(measurements || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={2} style={{ padding: 10, color: "#666" }}>
                                                    No measurements available
                                                </td>
                                            </tr>
                                        ) : (
                                            (measurements || []).map((m) => (
                                                <tr key={m._id || `${m.time || m.timestamp}-${m.value}`}>
                                                    <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                                                        {getMeasurementTime(m) ? new Date(getMeasurementTime(m)).toLocaleString() : "-"}
                                                    </td>
                                                    <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                                                        {String(getMeasurementValue(m) ?? "")}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ fontWeight: 700 }}>Measurements chart</div>
                            {chartData.length === 0 ? (
                                <div style={{ color: "#666" }}>No measurements available</div>
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 300,
                                        border: "1px solid #eee",
                                        borderRadius: 10,
                                        background: "#fff",
                                        padding: 10
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="createdAt" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="value" stroke="#2f6feb" dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

