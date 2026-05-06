import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import NavBar from "../components/NavBar";

const HOUSE_ID_STORAGE_KEY = "HOUSE_ID";

export default function HouseDetail({ showNavBar = true }) {
    const [house, setHouse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [roomName, setRoomName] = useState("");
    const [flowers, setFlowers] = useState([]);
    const [selectedFlowerByRoomId, setSelectedFlowerByRoomId] = useState({});
    const [memberId, setMemberId] = useState("");
    const [activeHouseId, setActiveHouseId] = useState(() => window.localStorage.getItem(HOUSE_ID_STORAGE_KEY) || "");
    const [devicesByRoomId, setDevicesByRoomId] = useState({});
    const [deviceNameByRoomId, setDeviceNameByRoomId] = useState({});

    const buttonStyle = (variant = "default") => ({
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #ddd",
        background: variant === "danger" ? "#fff5f5" : "#fff",
        cursor: "pointer",
        opacity: variant === "disabled" ? 0.6 : 1
    });

    const loadFlowers = async () => {
        try {
            console.log("REQUEST:", "/flower/list", null);
            const res = await api.get("/flower/list");
            console.log("RESPONSE:", res.data);
            setFlowers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
        }
    };

    const loadHouse = async (houseId = activeHouseId) => {
        const targetHouseId = typeof houseId === "string" ? houseId : activeHouseId;

        if (!targetHouseId) {
            setHouse(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const body = { id: targetHouseId };
            console.log("REQUEST:", "/home/load", body);
            const res = await api.post("/home/load", body);
            console.log("RESPONSE:", res.data);
            setHouse(res.data);
            const rooms = Array.isArray(res.data?.rooms) ? res.data.rooms : [];
            if (rooms.length > 0) {
                const entries = await Promise.all(
                    rooms.map(async (room) => {
                        try {
                            const deviceRes = await api.get("/device/list", { params: { roomId: room._id } });
                            return [room._id, Array.isArray(deviceRes.data) ? deviceRes.data : []];
                        } catch {
                            return [room._id, []];
                        }
                    })
                );
                setDevicesByRoomId(Object.fromEntries(entries));
            } else {
                setDevicesByRoomId({});
            }
        } catch (err) {
            const msg = err?.response?.data || err?.message || err;
            console.log("ERROR:", msg);
            setHouse(null);
            if (err?.response?.status === 404) {
                window.localStorage.removeItem(HOUSE_ID_STORAGE_KEY);
                setActiveHouseId("");
                setError(null);
            } else {
                setError("Failed to load data");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedHouseId = window.localStorage.getItem(HOUSE_ID_STORAGE_KEY) || "";
        if (storedHouseId) {
            Promise.resolve().then(() => {
                setActiveHouseId(storedHouseId);
                loadHouse(storedHouseId);
            });
        } else {
            Promise.resolve().then(() => {
                setIsLoading(false);
                setHouse(null);
                setError(null);
            });
        }
        Promise.resolve().then(() => {
            loadFlowers();
        });
    }, []);

    const handleCreateRoom = async () => {
        const name = roomName.trim();
        if (!name) return;

        try {
            setMessage(null);
            const body = { name, houseId: activeHouseId };
            console.log("REQUEST:", "/room/create", body);
            const res = await api.post("/room/create", body);
            console.log("RESPONSE:", res.data);
            setRoomName("");
            setMessage("Room created.");
            await loadHouse();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to create room.");
        }
    };

    const handleAddFlowerToRoom = async (roomId) => {
        const flowerId = selectedFlowerByRoomId[roomId];
        if (!flowerId) return;

        try {
            setMessage(null);
            const body = { roomId, flowerId };
            console.log("REQUEST:", "/room/addFlower", body);
            const res = await api.post("/room/addFlower", body);
            console.log("RESPONSE:", res.data);
            setMessage("Flower added.");
            await loadHouse();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to add flower.");
        }
    };

    const handleRemoveFlower = async (roomId, flowerId) => {
        try {
            setMessage(null);
            const body = { roomId, flowerId };
            console.log("REQUEST:", "/room/removeFlower", body);
            const res = await api.post("/room/removeFlower", body);
            console.log("RESPONSE:", res.data);
            setMessage("Flower removed.");
            await loadHouse();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to remove flower.");
        }
    };

    const handleRemoveRoom = async (roomId) => {
        try {
            setMessage(null);
            const body = { id: roomId };
            console.log("REQUEST:", "/room/delete", body);
            const res = await api.delete("/room/delete", { data: body });
            console.log("RESPONSE:", res.data);
            setMessage("Room removed.");
            await loadHouse();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to remove room.");
        }
    };

    const handleAddMember = async () => {
        const id = memberId.trim();
        if (!id) return;

        try {
            setMessage(null);
            const body = { houseId: activeHouseId, memberId: id };
            console.log("REQUEST:", "/home/addMember", body);
            const res = await api.post("/home/addMember", body);
            console.log("RESPONSE:", res.data);
            setMemberId("");
            setMessage("Member added.");
            await loadHouse();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to add member.");
        }
    };

    const handleRemoveMember = async (id) => {
        try {
            setMessage(null);
            const body = { houseId: activeHouseId, memberId: id };
            console.log("REQUEST:", "/home/removeMember", body);
            const res = await api.post("/home/removeMember", body);
            console.log("RESPONSE:", res.data);
            setMessage("Member removed.");
            await loadHouse();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to remove member.");
        }
    };

    const handleCreateDevice = async (roomId) => {
        try {
            setMessage(null);
            const name = (deviceNameByRoomId[roomId] || "").trim() || "Thermometer";
            const body = { roomId, name, status: "active" };
            console.log("REQUEST:", "/device/create", body);
            const res = await api.post("/device/create", body);
            console.log("RESPONSE:", res.data);
            setDevicesByRoomId((prev) => ({
                ...prev,
                [roomId]: [...(prev[roomId] || []), res.data]
            }));
            setDeviceNameByRoomId((prev) => ({ ...prev, [roomId]: "" }));
            setMessage("Device created.");
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to create device.");
        }
    };

    const handleRemoveDevice = async (roomId, deviceId) => {
        try {
            setMessage(null);
            const body = { id: deviceId };
            console.log("REQUEST:", "/device/delete", body);
            const res = await api.delete("/device/delete", { data: body });
            console.log("RESPONSE:", res.data);
            setDevicesByRoomId((prev) => ({
                ...prev,
                [roomId]: (prev[roomId] || []).filter((d) => d._id !== deviceId)
            }));
            setMessage("Device removed.");
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to remove device.");
        }
    };

    const handleSendMeasurement = async (roomId) => {
        try {
            setMessage(null);
            const body = {
                roomId,
                value: Number((15 + Math.random() * 15).toFixed(1)),
                unit: "C"
            };
            console.log("REQUEST:", "/measurement/create", body);
            const res = await api.post("/measurement/create", body);
            console.log("RESPONSE:", res.data);
            window.localStorage.setItem("MEASUREMENT_LAST_UPDATE", String(Date.now()));
            window.dispatchEvent(new CustomEvent("measurement-updated", { detail: { roomId } }));
            setMessage("Measurement sent.");
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to send measurement.");
        }
    };

    return (
        <div style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
            {showNavBar ? <NavBar /> : null}

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>House Detail</h2>
                <button
                    type="button"
                    onClick={() => loadHouse()}
                    style={{
                        ...buttonStyle()
                    }}
                >
                    Refresh
                </button>
            </div>

            <div style={{ marginTop: 14, color: "#666", fontSize: 13 }}>
                House id used for load: <code>{activeHouseId}</code>
            </div>

            {message && (
                <div style={{ marginTop: 12, padding: 10, border: "1px solid #eee", borderRadius: 8 }}>
                    {message}
                </div>
            )}

            {isLoading ? (
                <div style={{ marginTop: 16 }}>Loading...</div>
            ) : !house ? (
                <div style={{ marginTop: 16 }}>
                    <div style={{ color: error ? "#b00020" : "#666" }}>{error || "No active house selected"}</div>
                    <div style={{ marginTop: 10 }}>
                        <Link to="/houses">Go to Houses</Link>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: "#666" }}>House Name</div>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>{house.name || "(missing name)"}</div>
                        <div style={{ fontSize: 13, color: "#666" }}>House ID</div>
                        <div style={{ fontWeight: 700 }}>{house._id || "(missing _id)"}</div>
                    </div>

                    <div
                        style={{
                            border: "1px solid #eee",
                            borderRadius: 10,
                            padding: 12,
                            background: "#fafafa"
                        }}
                    >
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Members</div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {(house.members || []).length === 0 ? (
                                <div style={{ color: "#666" }}>No members</div>
                            ) : (
                                (house.members || []).map((m) => (
                                    <div
                                        key={String(m)}
                                        style={{
                                            padding: "6px 8px",
                                            border: "1px solid #eee",
                                            borderRadius: 8,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            background: "#fff"
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>{String(m)}</div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMember(String(m))}
                                            style={buttonStyle("danger")}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                                <input
                                    value={memberId}
                                    onChange={(e) => setMemberId(e.target.value)}
                                    placeholder="userId"
                                    style={{
                                        padding: 8,
                                        borderRadius: 8,
                                        border: "1px solid #ddd",
                                        flex: "1 1 240px",
                                        background: "#fff"
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMember}
                                    disabled={!memberId.trim()}
                                    style={buttonStyle(!memberId.trim() ? "disabled" : "default")}
                                >
                                    Add Member
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            border: "1px solid #eee",
                            borderRadius: 10,
                            padding: 12,
                            background: "#fafafa",
                            marginBottom: 16
                        }}
                    >
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Create Room</div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <input
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Room name"
                                style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", flex: "1 1 240px" }}
                            />
                            <button
                                type="button"
                                onClick={handleCreateRoom}
                                disabled={!roomName.trim()}
                                style={buttonStyle(!roomName.trim() ? "disabled" : "default")}
                            >
                                Create Room
                            </button>
                        </div>
                    </div>

                    <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Rooms</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                        {(house.rooms || []).map((r) => {
                            const flowerIdsInRoom = new Set((r.flowers || []).map((f) => f?._id));
                            const availableToAdd = (flowers || []).filter((f) => !flowerIdsInRoom.has(f._id));
                            const selected = selectedFlowerByRoomId[r._id] || "";

                            return (
                                <div
                                    key={r._id}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: 10,
                                        padding: 12,
                                        background: "#fff"
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 10
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRoom(r._id)}
                                            style={buttonStyle("danger")}
                                        >
                                            Remove Room
                                        </button>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Flowers</div>

                                        {!r.flowers || r.flowers.length === 0 ? (
                                            <div style={{ color: "#666" }}>No flowers</div>
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {r.flowers.map((f) => (
                                                    <div
                                                        key={f._id}
                                                        style={{
                                                            padding: "6px 8px",
                                                            border: "1px solid #eee",
                                                            borderRadius: 8,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 10
                                                        }}
                                                    >
                                                        <div style={{ flex: 1 }}>🌸 {f.name}</div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFlower(r._id, f._id)}
                                                            style={buttonStyle("danger")}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        <select
                                            value={selected}
                                            onChange={(e) =>
                                                setSelectedFlowerByRoomId((p) => ({ ...p, [r._id]: e.target.value }))
                                            }
                                            style={{
                                                padding: 8,
                                                borderRadius: 8,
                                                border: "1px solid #ddd",
                                                flex: "1 1 260px",
                                                background: "#fff"
                                            }}
                                        >
                                            <option value="">Select a flower to add</option>
                                            {availableToAdd.map((f) => (
                                                <option key={f._id} value={f._id}>
                                                    {f.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleAddFlowerToRoom(r._id)}
                                            disabled={!selected}
                                            style={buttonStyle(!selected ? "disabled" : "default")}
                                        >
                                            Add Flower
                                        </button>
                                    </div>

                                    <div style={{ marginTop: 12 }}>
                                        <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Devices</div>
                                        {(devicesByRoomId[r._id] || []).length === 0 ? (
                                            <div style={{ color: "#666", marginBottom: 8 }}>No devices</div>
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                                                {(devicesByRoomId[r._id] || []).map((d) => (
                                                    <div
                                                        key={d._id}
                                                        style={{
                                                            padding: "6px 8px",
                                                            border: "1px solid #eee",
                                                            borderRadius: 8,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 10
                                                        }}
                                                    >
                                                        <div style={{ flex: 1 }}>
                                                            {d.name || "Thermometer"} ({String(d._id || "").slice(-6)})
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSendMeasurement(r._id)}
                                                            style={buttonStyle()}
                                                        >
                                                            Send Measurement
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveDevice(r._id, d._id)}
                                                            style={buttonStyle("danger")}
                                                        >
                                                            Remove Device
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                            <input
                                                value={deviceNameByRoomId[r._id] || ""}
                                                onChange={(e) =>
                                                    setDeviceNameByRoomId((prev) => ({ ...prev, [r._id]: e.target.value }))
                                                }
                                                placeholder="Thermometer name"
                                                style={{
                                                    padding: 8,
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                    flex: "1 1 240px",
                                                    background: "#fff"
                                                }}
                                            />
                                            <button type="button" onClick={() => handleCreateDevice(r._id)} style={buttonStyle()}>
                                                Add Device
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

