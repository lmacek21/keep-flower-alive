import { useNavigate } from "react-router-dom";

export default function RoomCard({
  room,
  measurement,
  isOwner,
  onDetails,
  onConnect,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm d-flex flex-column">
      <div
        className="card-header fw-semibold d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "var(--c-dark-green)",
          color: "var(--c-white)",
        }}
      >
        {room.name}
        {isOwner && (
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-light py-0 px-2"
              onClick={() => onConnect(room)}
            >
              Connect
            </button>
            <button
              className="btn btn-sm btn-danger py-0 px-2"
              onClick={() => onDelete(room)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="card-body flex-grow-1 d-flex p-2">
        <div className="row g-0 w-100">
          <div className="col-7 border-end pe-2 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center">
              {room.flowers.length === 0 ? (
                <p
                  className="text-muted mb-0 w-100 text-center"
                  style={{ fontSize: "0.85rem" }}
                >
                  No flowers.
                </p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {room.flowers.slice(0, 3).map((flower) => (
                    <li key={flower._id} style={{ fontSize: "0.85rem" }}>
                      🌸 {flower.name}
                    </li>
                  ))}
                  {room.flowers.length > 3 && (
                    <li className="text-muted" style={{ fontSize: "0.8rem" }}>
                      …more in details
                    </li>
                  )}
                </ul>
              )}
            </div>
            <button
              className="btn btn-app btn-sm w-100 mt-2"
              onClick={() => onDetails(room)}
            >
              Details
            </button>
          </div>
          <div className="col-5 ps-2 d-flex flex-column align-items-center text-center">
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
              {measurement ? (
                <>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      color: "var(--c-dark-green)",
                    }}
                  >
                    {measurement.value} {measurement.unit}
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    {new Date(measurement.measuredAt).toLocaleString()}
                  </small>
                </>
              ) : (
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                  No data
                </span>
              )}
            </div>
            <button
              className="btn btn-app btn-sm w-100 mt-2"
              onClick={() =>
                navigate(`/stats/${room._id}`, { state: { room } })
              }
            >
              Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
