export default function FlowerList({ flowers, onRemoveFlower, roomId }) {
    const list = Array.isArray(flowers) ? flowers : [];

    if (list.length === 0) {
        return <div style={{ color: "#666" }}>No flowers</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {list.map((f) => (
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

                    {onRemoveFlower && (
                        <button
                            type="button"
                            onClick={() => onRemoveFlower(roomId, f._id)}
                            style={{
                                padding: "6px 8px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: "#fff5f5",
                                cursor: "pointer"
                            }}
                        >
                            Remove Flower
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
