import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getUser, handleAuthError } from "../utils/auth";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import FlowerCard from "../components/FlowerCard";

export default function FlowersPage() {
  const [flowers, setFlowers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    minTemp: "",
    maxTemp: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [addToRoom, setAddToRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();
  const user = getUser();
  const isSuperUser = user?.role === "superuser";

  useEffect(() => {
    api
      .get("/flower/list")
      .then(setFlowers)
      .catch((err) => {
        if (!handleAuthError(err, navigate)) setError(err.message);
      });
    api
      .get("/house/rooms")
      .then(setRooms)
      .catch(() => {});
  }, [navigate]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError(null);
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.description) formData.append("description", form.description);
      if (form.minTemp !== "") formData.append("minTemp", form.minTemp);
      if (form.maxTemp !== "") formData.append("maxTemp", form.maxTemp);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/flower/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      const updated = await api.get("/flower/list");
      setFlowers(updated);
      closeModal();
    } catch (err) {
      if (!handleAuthError(err, navigate)) setFormError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function handleDelete(flowerId) {
    setConfirm({
      message: "Delete this flower? It will be removed from all rooms.",
      action: async () => {
        await api.delete("/flower/delete", { id: flowerId });
        setFlowers((prev) => prev.filter((f) => f._id !== flowerId));
      },
    });
  }

  function closeModal() {
    setShowModal(false);
    setForm({ name: "", description: "", minTemp: "", maxTemp: "" });
    setImageFile(null);
    setFormError(null);
  }

  function openAddToRoom(flower) {
    setAddToRoom(flower);
    setSelectedRoom(rooms[0]?._id ?? "");
    setAssignError(null);
  }

  function closeAddToRoom() {
    setAddToRoom(null);
    setSelectedRoom("");
    setAssignError(null);
  }

  async function handleAssign(e) {
    e.preventDefault();
    setAssigning(true);
    setAssignError(null);
    try {
      await api.post("/room/addFlower", {
        roomId: selectedRoom,
        flowerId: addToRoom._id,
      });
      closeAddToRoom();
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setAssigning(false);
    }
  }

  if (error) return <p className="p-4">Error: {error}</p>;

  const filtered = flowers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const noMatch = flowers.length > 0 && search && filtered.length === 0;

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="mb-0" style={{ color: "var(--c-dark-green)" }}>
          Flowers
        </h1>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 120, maxWidth: 220 }}
          />
          {isSuperUser && (
            <button className="btn btn-app" onClick={() => setShowModal(true)}>
              + Add Flower
            </button>
          )}
        </div>
      </div>

      {flowers.length === 0 && <p>No flowers found.</p>}
      {noMatch && (
        <p className="text-muted">
          No flowers&apos;s name match &ldquo;{search}&rdquo;.
        </p>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {filtered.map((flower) => (
          <div key={flower._id} className="col">
            <FlowerCard
              flower={flower}
              onDelete={isSuperUser ? handleDelete : undefined}
              onAddToRoom={rooms.length > 0 ? openAddToRoom : undefined}
            />
          </div>
        ))}
      </div>

      {confirm && (
        <ConfirmModal
          title="Delete Flower"
          message={confirm.message}
          confirmLabel="Delete"
          onConfirm={async () => {
            try {
              await confirm.action();
            } catch (err) {
              setError(err.message);
            } finally {
              setConfirm(null);
            }
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {addToRoom && (
        <Modal
          title={
            <>
              Add <em>{addToRoom.name}</em> to Room
            </>
          }
          onClose={closeAddToRoom}
        >
          <form onSubmit={handleAssign}>
            <div className="modal-body">
              <select
                className="form-select"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
              >
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {assignError && (
                <div className="alert alert-danger py-2 mt-2 mb-0">
                  {assignError}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeAddToRoom}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-app"
                disabled={assigning}
              >
                {assigning ? "Adding…" : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showModal && (
        <Modal title="Add Flower" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <div className="modal-body d-flex flex-column gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                autoFocus
              />
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min temp (°C)"
                  value={form.minTemp}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, minTemp: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max temp (°C)"
                  value={form.maxTemp}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxTemp: e.target.value }))
                  }
                />
              </div>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {formError && (
                <div className="alert alert-danger py-2 mb-0">{formError}</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-app" disabled={creating}>
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
