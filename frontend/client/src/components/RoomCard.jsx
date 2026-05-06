import FlowerList from "./FlowerList";

export default function RoomCard({ room, onRemoveFlower }) {
    if (!room) return null;

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
                background: "#fff"
            }}
        >
            <div style={{ fontWeight: 700, fontSize: 15 }}>{room.name}</div>
            <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: "#666" }}>Flowers</div>
                <FlowerList flowers={room.flowers} onRemoveFlower={onRemoveFlower} roomId={room._id} />
            </div>
        </div>
    );
}
