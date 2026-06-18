export default function FlowerSelector({
  flowers,
  selectedFlowerId,
  onToggle,
}) {
  return (
    <div className="card shadow-sm h-100">
      <div
        className="card-header fw-semibold"
        style={{
          backgroundColor: "var(--c-dark-green)",
          color: "var(--c-white)",
        }}
      >
        Flowers
      </div>
      <div className="card-body p-0">
        {flowers.length === 0 ? (
          <p className="text-muted p-3 mb-0">No flowers assigned.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {flowers.map((flower) => {
              const selected = selectedFlowerId === flower._id;
              return (
                <li
                  key={flower._id}
                  className="list-group-item d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: selected
                      ? "var(--c-mid-green)"
                      : "var(--c-light)",
                    color: selected ? "var(--c-white)" : "inherit",
                    cursor: "pointer",
                  }}
                  onClick={() => onToggle(flower._id)}
                >
                  {flower.image ? (
                    <img
                      src={flower.image}
                      alt={flower.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "var(--c-white)",
                        borderRadius: 4,
                      }}
                    >
                      🌸
                    </div>
                  )}
                  <div>
                    <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                      {flower.name}
                    </div>
                    {(flower.minTemp != null || flower.maxTemp != null) && (
                      <small className={selected ? "" : "text-muted"}>
                        {flower.minTemp ?? "—"}–{flower.maxTemp ?? "—"} °C
                      </small>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
