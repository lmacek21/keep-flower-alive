import { useState } from "react";

export default function MembersCard({ members, isOwner, onRemoveMember }) {
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) =>
    m.email.toLowerCase().includes(search.toLowerCase()),
  );
  const noMatch = members.length > 0 && search && filtered.length === 0;

  return (
    <div className="card shadow-sm h-100 d-flex flex-column">
      <div
        className="card-header fw-semibold d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "var(--c-dark-green)",
          color: "var(--c-white)",
        }}
      >
        Members
        <input
          type="text"
          className="form-control form-control-sm ms-2"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            minWidth: 60,
            maxWidth: 130,
            backgroundColor: "var(--c-light)",
            border: "none",
          }}
        />
      </div>
      <div className="card-body p-0 flex-grow-1 overflow-y-auto">
        {members.length === 0 ? (
          <p className="text-muted p-3 mb-0">No members yet.</p>
        ) : noMatch ? (
          <p className="text-muted p-3 mb-0">
            No member match &ldquo;{search}&rdquo;.
          </p>
        ) : (
          <ul className="list-group list-group-flush">
            {filtered.map((m) => (
              <li
                key={m.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "var(--c-light)" }}
              >
                <span>{m.email}</span>
                {isOwner && (
                  <button
                    className="btn btn-sm btn-danger p-0"
                    style={{ width: "1.5rem", height: "1.5rem", lineHeight: 1 }}
                    onClick={() => onRemoveMember(m.id)}
                  >
                    &times;
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
