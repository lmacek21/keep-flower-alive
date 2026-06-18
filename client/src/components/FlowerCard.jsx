import { useState } from "react";
import Modal from "./Modal";

export default function FlowerCard({
  flower,
  imageHeight = 200,
  onDelete,
  onAddToRoom,
  onRemoveFromRoom,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="card h-100 shadow-sm">
        {flower.image ? (
          <img
            src={flower.image}
            alt={flower.name}
            className="card-img-top"
            style={{ height: imageHeight, objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center text-muted"
            style={{
              height: imageHeight,
              backgroundColor: "var(--c-light)",
              fontSize: "0.85rem",
            }}
          >
            No image
          </div>
        )}
        <div
          className="card-header d-flex justify-content-between align-items-center fw-semibold"
          style={{
            backgroundColor: "var(--c-dark-green)",
            color: "var(--c-white)",
          }}
        >
          {flower.name}
          <div className="d-flex gap-1">
            {onAddToRoom && (
              <button
                className="btn btn-sm btn-outline-light py-0 px-2"
                onClick={() => onAddToRoom(flower)}
              >
                + Add to Room
              </button>
            )}
            {onRemoveFromRoom && (
              <button
                className="btn btn-sm btn-danger py-0 px-2"
                onClick={() => onRemoveFromRoom(flower._id)}
              >
                Remove
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm btn-danger py-0 px-2"
                onClick={() => onDelete(flower._id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div
          className="card-body"
          style={{ maxHeight: 90, overflow: "hidden" }}
        >
          {flower.description && (
            <p className="card-text text-muted mb-0">{flower.description}</p>
          )}
        </div>
        <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center pt-0">
          {flower.minTemp != null || flower.maxTemp != null ? (
            <small className="text-muted">
              <strong>Temperature:</strong> {flower.minTemp ?? "—"} °C –{" "}
              {flower.maxTemp ?? "—"} °C
            </small>
          ) : (
            <span />
          )}
          <button
            className="btn btn-app-outline btn-sm"
            onClick={() => setExpanded(true)}
          >
            Expand
          </button>
        </div>
      </div>

      {expanded && (
        <Modal title={flower.name} onClose={() => setExpanded(false)}>
          <div className="modal-body">
            {flower.image ? (
              <img
                src={flower.image}
                alt={flower.name}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: 300, width: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center text-muted rounded mb-3"
                style={{
                  height: 120,
                  backgroundColor: "var(--c-light)",
                  fontSize: "0.85rem",
                }}
              >
                No image
              </div>
            )}
            {flower.description && (
              <p className="text-muted mb-3">{flower.description}</p>
            )}
            {(flower.minTemp != null || flower.maxTemp != null) && (
              <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                <strong>Temperature:</strong> {flower.minTemp ?? "—"} °C –{" "}
                {flower.maxTemp ?? "—"} °C
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setExpanded(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
