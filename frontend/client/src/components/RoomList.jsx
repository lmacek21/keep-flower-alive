import RoomCard from "./RoomCard";

export default function RoomList({ rooms, onRemoveFlower }) {
    const list = Array.isArray(rooms) ? rooms : [];

    if (list.length === 0) {
        return <div style={{ color: "#666" }}>No rooms found.</div>;
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {list.map((r) => (
                <RoomCard key={r._id} room={r} onRemoveFlower={onRemoveFlower} />
            ))}
        </div>
    );
}
