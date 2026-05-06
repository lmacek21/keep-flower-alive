import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import FlowerCard from "../components/FlowerCard";

export default function FlowerList() {
    const [flowers, setFlowers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewFlower, setShowNewFlower] = useState(false);
    const [message, setMessage] = useState(null);
    const [newFlower, setNewFlower] = useState({
        name: "",
        description: "",
        minTemp: "",
        maxTemp: ""
    });
    const [newFlowerImage, setNewFlowerImage] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editFlower, setEditFlower] = useState({
        id: "",
        name: "",
        description: "",
        minTemp: "",
        maxTemp: ""
    });
    const [editFlowerImage, setEditFlowerImage] = useState(null);

    const canSubmitNew = useMemo(() => {
        return (
            newFlower.name.trim().length > 0 &&
            newFlower.description.trim().length > 0 &&
            String(newFlower.minTemp).trim().length > 0 &&
            String(newFlower.maxTemp).trim().length > 0
        );
    }, [newFlower]);

    const canSubmitEdit = useMemo(() => {
        return (
            editFlower.id &&
            editFlower.name.trim().length > 0 &&
            editFlower.description.trim().length > 0 &&
            String(editFlower.minTemp).trim().length > 0 &&
            String(editFlower.maxTemp).trim().length > 0
        );
    }, [editFlower]);

    const loadFlowers = async () => {
        setIsLoading(true);
        try {
            console.log("REQUEST:", "/flower/list", null);
            const res = await api.get("/flower/list");
            console.log("RESPONSE:", res.data);
            setFlowers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            loadFlowers();
        });
    }, []);

    const handleCreateFlower = async (e) => {
        e.preventDefault();
        try {
            setMessage(null);

            const payload = new FormData();
            payload.append("name", newFlower.name.trim());
            payload.append("description", newFlower.description.trim());
            payload.append("minTemp", String(Number(newFlower.minTemp)));
            payload.append("maxTemp", String(Number(newFlower.maxTemp)));
            if (newFlowerImage) {
                payload.append("image", newFlowerImage);
            }
            console.log("REQUEST:", "/flower/create", payload);

            const res = await api.post("/flower/create", payload);
            console.log("RESPONSE:", res.data);

            setNewFlower({ name: "", description: "", minTemp: "", maxTemp: "" });
            setNewFlowerImage(null);
            setShowNewFlower(false);
            setMessage("Flower created.");
            await loadFlowers();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to create flower.");
        }
    };

    const handleDeleteFlower = async (flower) => {
        try {
            setMessage(null);
            console.log("REQUEST:", "/flower/delete", { id: flower._id });
            const res = await api.delete("/flower/delete", { data: { id: flower._id } });
            console.log("RESPONSE:", res.data);
            setMessage("Flower deleted.");
            await loadFlowers();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to delete flower.");
        }
    };

    const beginEdit = (flower) => {
        setMessage(null);
        setEditingId(flower._id);
        setEditFlower({
            id: flower._id,
            name: flower.name || "",
            description: flower.description || "",
            minTemp: flower.minTemp ?? "",
            maxTemp: flower.maxTemp ?? ""
        });
        setEditFlowerImage(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditFlower({ id: "", name: "", description: "", minTemp: "", maxTemp: "" });
        setEditFlowerImage(null);
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        try {
            setMessage(null);
            const payload = new FormData();
            payload.append("id", editFlower.id);
            payload.append("name", editFlower.name.trim());
            payload.append("description", editFlower.description.trim());
            payload.append("minTemp", String(Number(editFlower.minTemp)));
            payload.append("maxTemp", String(Number(editFlower.maxTemp)));
            if (editFlowerImage) {
                payload.append("image", editFlowerImage);
            }
            console.log("REQUEST:", "/flower/update", payload);
            const res = await api.post("/flower/update", payload);
            console.log("RESPONSE:", res.data);
            setMessage("Flower updated.");
            cancelEdit();
            await loadFlowers();
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err?.message || err);
            setMessage("Failed to update flower.");
        }
    };

    return (
        <div style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
            <NavBar />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>Flower List</h2>

                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        type="button"
                        onClick={() => setShowNewFlower((v) => !v)}
                        style={{
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        New Flower
                    </button>

                    <button
                        type="button"
                        onClick={loadFlowers}
                        style={{
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {message && (
                <div style={{ marginTop: 12, padding: 10, border: "1px solid #eee", borderRadius: 8 }}>
                    {message}
                </div>
            )}

            {showNewFlower && (
                <form
                    onSubmit={handleCreateFlower}
                    style={{
                        marginTop: 12,
                        border: "1px solid #eee",
                        borderRadius: 10,
                        padding: 12,
                        background: "#fafafa"
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>Create a new flower</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input
                            placeholder="Name"
                            value={newFlower.name}
                            onChange={(e) => setNewFlower((p) => ({ ...p, name: e.target.value }))}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                        />
                        <input
                            placeholder="Description"
                            value={newFlower.description}
                            onChange={(e) => setNewFlower((p) => ({ ...p, description: e.target.value }))}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                        />
                        <input
                            placeholder="Min temp"
                            value={newFlower.minTemp}
                            onChange={(e) => setNewFlower((p) => ({ ...p, minTemp: e.target.value }))}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                        />
                        <input
                            placeholder="Max temp"
                            value={newFlower.maxTemp}
                            onChange={(e) => setNewFlower((p) => ({ ...p, maxTemp: e.target.value }))}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewFlowerImage(e.target.files?.[0] || null)}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                        <button
                            type="submit"
                            disabled={!canSubmitNew}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: canSubmitNew ? "#f7f7f7" : "#eee",
                                cursor: canSubmitNew ? "pointer" : "not-allowed"
                            }}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowNewFlower(false)}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div style={{ marginTop: 16 }}>Loading...</div>
            ) : (
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                    {flowers.length === 0 ? (
                        <div style={{ color: "#666" }}>No flowers found.</div>
                    ) : (
                        flowers.map((f) => (
                            <FlowerCard
                                key={f._id}
                                flower={f}
                                onEdit={beginEdit}
                                onDelete={handleDeleteFlower}
                            >
                                {editingId === f._id && (
                                    <form onSubmit={saveEdit} style={{ marginTop: 8 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                            <input
                                                placeholder="Name"
                                                value={editFlower.name}
                                                onChange={(e) => setEditFlower((p) => ({ ...p, name: e.target.value }))}
                                                style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                                            />
                                            <input
                                                placeholder="Description"
                                                value={editFlower.description}
                                                onChange={(e) =>
                                                    setEditFlower((p) => ({ ...p, description: e.target.value }))
                                                }
                                                style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                                            />
                                            <input
                                                placeholder="Min temp"
                                                value={editFlower.minTemp}
                                                onChange={(e) =>
                                                    setEditFlower((p) => ({ ...p, minTemp: e.target.value }))
                                                }
                                                style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                                            />
                                            <input
                                                placeholder="Max temp"
                                                value={editFlower.maxTemp}
                                                onChange={(e) =>
                                                    setEditFlower((p) => ({ ...p, maxTemp: e.target.value }))
                                                }
                                                style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setEditFlowerImage(e.target.files?.[0] || null)}
                                                style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                                            />
                                        </div>

                                        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                                            <button
                                                type="submit"
                                                disabled={!canSubmitEdit}
                                                style={{
                                                    padding: "8px 10px",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                    background: canSubmitEdit ? "#f7f7f7" : "#eee",
                                                    cursor: canSubmitEdit ? "pointer" : "not-allowed"
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                style={{
                                                    padding: "8px 10px",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                    background: "#fff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </FlowerCard>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

