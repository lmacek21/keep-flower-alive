import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import NavBar from "../components/NavBar";

const HOUSE_ID_STORAGE_KEY = "HOUSE_ID";
const OWNER_ID_STORAGE_KEY = "OWNER_ID";

function buttonStyle(variant = "default") {
    return {
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #ddd",
        background: variant === "danger" ? "#fff5f5" : "#fff",
        cursor: "pointer"
    };
}

export default function Houses() {
    const navigate = useNavigate();

    const [houses, setHouses] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeHouseId, setActiveHouseId] = useState(
        () => window.localStorage.getItem(HOUSE_ID_STORAGE_KEY) || ""
    );

    // ✅ Normalize house name
    const normalizeHouse = (h) => ({
        ...h,
        _id: h?._id || h?.id || "",
        name: h?.name && h.name.trim() !== "" ? h.name : (h?.ownerId ? `House (${h.ownerId})` : "Unnamed house")
    });

    // ✅ Load houses
    const loadHouses = async () => {
        setIsLoading(true);
        try {
            console.log("REQUEST:", "/home/list");
            const res = await api.get("/home/list");
            console.log("RESPONSE:", res.data);

            const list = Array.isArray(res.data)
                ? res.data.map(normalizeHouse)
                : [];

            setHouses(list);
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to load houses.");
            setHouses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            loadHouses();
        });
    }, []);

    // ✅ CREATE HOUSE (clean version)
    const handleCreateHouse = async () => {
        const houseName = name.trim();
        if (!houseName) return;

        try {
            setMessage(null);

            const ownerId = window.localStorage.getItem(OWNER_ID_STORAGE_KEY) || `owner-${Date.now()}`;
            window.localStorage.setItem(OWNER_ID_STORAGE_KEY, ownerId);

            console.log("CREATE REQUEST:", { name: houseName });

            let res;
            try {
                res = await api.post("/home/create", { name: houseName });
            } catch (err) {
                const details = err?.response?.data?.details;
                const missingOwnerId = Array.isArray(details)
                    && details.some((d) => d?.keyword === "required" && d?.params?.missingProperty === "ownerId");
                if (!missingOwnerId) {
                    throw err;
                }
                // Back-compat: older backend contract requiring ownerId instead of name.
                console.log("CREATE REQUEST:", { ownerId });
                res = await api.post("/home/create", { ownerId });
            }

            console.log("CREATE RESPONSE:", res.data);

            const created = normalizeHouse({ ...res.data, name: res?.data?.name || houseName });
            const newId = created?._id;

            if (!newId) {
                setMessage("House created but missing ID.");
                return;
            }

            window.localStorage.setItem(HOUSE_ID_STORAGE_KEY, newId);
            setActiveHouseId(newId);
            setName("");

            // update UI instantly
            setHouses((prev) => [
                created,
                ...prev.filter((h) => h._id !== newId)
            ]);

            setMessage("House created.");
        } catch (err) {
            console.log("CREATE ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to create house.");
        }
    };

    // ✅ OPEN HOUSE
    const handleOpenHouse = (id) => {
        console.log("OPEN HOUSE:", id);
        window.localStorage.setItem(HOUSE_ID_STORAGE_KEY, id);
        setActiveHouseId(id);
        navigate("/houseDetail");
    };

    // ✅ DELETE HOUSE (fixed + debug)
    const handleDeleteHouse = async (id) => {
        try {
            setMessage(null);

            console.log("DELETE REQUEST:", { id });

            let res;
            try {
                res = await api.delete("/home/delete", { data: { id } });
            } catch {
                // Back-compat for environments that drop DELETE body.
                res = await api.post("/home/delete", { id });
            }

            console.log("DELETE RESPONSE:", res.data);

            setHouses((prev) => prev.filter((h) => h._id !== id));

            if (window.localStorage.getItem(HOUSE_ID_STORAGE_KEY) === id) {
                window.localStorage.removeItem(HOUSE_ID_STORAGE_KEY);
                setActiveHouseId("");
            }

            setMessage("House removed.");
        } catch (err) {
            const fullError = err?.response?.data || err?.message || err;
            console.log("DELETE ERROR FULL:", fullError);

            setMessage(
                fullError?.error ||
                JSON.stringify(fullError) ||
                "Failed to remove house."
            );
        }
    };

    return (
        <div style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
            <NavBar />

            <h2>Houses</h2>

            {/* CREATE */}
            <div style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                background: "#fafafa",
                marginBottom: 16
            }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    Create House
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="House name"
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            flex: 1
                        }}
                    />

                    <button
                        onClick={handleCreateHouse}
                        disabled={!name.trim()}
                        style={buttonStyle()}
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* MESSAGE */}
            {message && (
                <div style={{
                    marginBottom: 12,
                    padding: 10,
                    border: "1px solid #eee",
                    borderRadius: 8
                }}>
                    {message}
                </div>
            )}

            {/* LIST */}
            {isLoading ? (
                <div>Loading...</div>
            ) : houses.length === 0 ? (
                <div>No houses available.</div>
            ) : (
                <div style={{ display: "grid", gap: 10 }}>
                    {houses.map((h) => {
                        const houseId = h._id || h.id;
                        if (!houseId) return null;
                        return (
                        <div
                            key={houseId}
                            style={{
                                border: "1px solid #eee",
                                borderRadius: 10,
                                padding: 12,
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>
                                    {h.name}
                                </div>
                                <div style={{ fontSize: 12, color: "#666" }}>
                                    {houseId}
                                </div>

                                {activeHouseId === houseId && (
                                    <div style={{ color: "#2f6feb", fontSize: 12 }}>
                                        Active
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleOpenHouse(houseId)}
                                style={buttonStyle()}
                            >
                                Open
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDeleteHouse(houseId)}
                                style={buttonStyle("danger")}
                            >
                                Remove
                            </button>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}