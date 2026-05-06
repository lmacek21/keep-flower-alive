import api from "../services/api";

export default function FlowerCard({ flower, onAdd, onEdit, onDelete, children }) {
    if (!flower) return null;
    const imageSrc = flower.image
        ? (flower.image.startsWith("http") ? flower.image : `${api.defaults.baseURL}${flower.image}`)
        : null;

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
                background: "#fff"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{flower.name}</div>
                    <div style={{ color: "#444", marginTop: 6 }}>{flower.description}</div>
                    <div style={{ color: "#666", marginTop: 8, fontSize: 13 }}>
                        Temp: {flower.minTemp}°C - {flower.maxTemp}°C
                    </div>
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={flower.name}
                            style={{
                                marginTop: 10,
                                width: 140,
                                height: 140,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #eee"
                            }}
                        />
                    ) : null}
                </div>

                <div style={{ display: "flex", alignItems: "start", gap: 8, flexWrap: "wrap" }}>
                    {onAdd && (
                        <button
                            type="button"
                            onClick={() => onAdd?.(flower._id)}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: "#f7f7f7",
                                cursor: "pointer"
                            }}
                        >
                            Add Flower
                        </button>
                    )}

                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit?.(flower)}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Edit
                        </button>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete?.(flower)}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: "#fff5f5",
                                cursor: "pointer"
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {children && <div style={{ marginTop: 12 }}>{children}</div>}
        </div>
    );
}
