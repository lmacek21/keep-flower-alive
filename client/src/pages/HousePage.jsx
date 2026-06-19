import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { getUser, handleAuthError } from "../utils/auth";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import RoomCard from "../components/RoomCard";
import MembersCard from "../components/MembersCard";
import FlowerCard from "../components/FlowerCard";

export default function HousePage() {
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomError, setRoomError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [foundMember, setFoundMember] = useState(null);
  const [memberSearchError, setMemberSearchError] = useState(null);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [connectRoom, setConnectRoom] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connectError, setConnectError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [measurements, setMeasurements] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [houseSecret, setHouseSecret] = useState(null);
  const [secretLoading, setSecretLoading] = useState(false);
  const [secretError, setSecretError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  async function loadHouse(houseId) {
    const houseData = await api.get("/house/load", { id: houseId });
    setHouse(houseData);
    const results = await Promise.allSettled(
      houseData.rooms.map((r) =>
        api.get("/measurement/getLatest", { roomId: r._id }),
      ),
    );
    const map = {};
    houseData.rooms.forEach((r, i) => {
      if (results[i].status === "fulfilled") map[r._id] = results[i].value;
    });
    setMeasurements(map);
  }

  useEffect(() => {
    async function init() {
      try {
        let houseId = id;
        if (!houseId) {
          const houses = await api.get("/house/list");
          const user = getUser();
          const owned = houses.find((h) => h.owner.id === user.id);
          if (!owned) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          houseId = owned._id;
        }
        await loadHouse(houseId);
      } catch (err) {
        if (!handleAuthError(err, navigate)) setError(err.message);
      }
    }
    init();
  }, [id, navigate]);

  async function handleCreateRoom(e) {
    e.preventDefault();
    setRoomError(null);
    setCreating(true);
    try {
      await api.post("/room/create", { name: roomName, houseId: house._id });
      await loadHouse(house._id);
      setShowModal(false);
      setRoomName("");
    } catch (err) {
      setRoomError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setRoomName("");
    setRoomError(null);
  }

  function closeMemberModal() {
    setShowMemberModal(false);
    setMemberEmail("");
    setFoundMember(null);
    setMemberSearchError(null);
  }

  async function handleSearchMember(e) {
    e.preventDefault();
    setFoundMember(null);
    setMemberSearchError(null);
    setSearching(true);
    try {
      const user = await api.get("/user/find", { email: memberEmail });
      setFoundMember(user);
    } catch (err) {
      setMemberSearchError(err.message);
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirm() {
    try {
      await confirm.action();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirm(null);
    }
  }

  function handleDeleteRoom(room) {
    setConfirm({
      title: "Delete Room",
      message: `Delete room "${room.name}"? All its measurements will be removed and devices will be unassigned.`,
      confirmLabel: "Delete",
      action: async () => {
        await api.delete("/room/delete", { id: room._id });
        await loadHouse(house._id);
      },
    });
  }

  async function handleOpenConnect(room) {
    setConnectError(null);
    setConnectRoom(room);
    try {
      const data = await api.get("/device/list", { houseId: house._id });
      setDevices(data);
    } catch (err) {
      setConnectError(err.message);
    }
  }

  function closeConnectModal() {
    setConnectRoom(null);
    setDevices([]);
    setConnectError(null);
  }

  async function handleAssignDevice(deviceId) {
    setConnecting(true);
    setConnectError(null);
    try {
      await api.post("/device/assignRoom", {
        id: deviceId,
        roomId: connectRoom._id,
      });
      closeConnectModal();
    } catch (err) {
      setConnectError(err.message);
    } finally {
      setConnecting(false);
    }
  }

  async function handleUnassignDevice(deviceId) {
    setConnecting(true);
    setConnectError(null);
    try {
      await api.post("/device/unassignRoom", { id: deviceId });
      closeConnectModal();
    } catch (err) {
      setConnectError(err.message);
    } finally {
      setConnecting(false);
    }
  }

  async function handleRemoveFlowerFromRoom(flowerId) {
    try {
      await api.post("/room/removeFlower", {
        roomId: selectedRoom._id,
        flowerId,
      });
      setSelectedRoom((prev) => ({
        ...prev,
        flowers: prev.flowers.filter((f) => f._id !== flowerId),
      }));
      await loadHouse(house._id);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleRemoveMember(memberId) {
    setConfirm({
      title: "Remove Member",
      message: "Remove this member from the house?",
      confirmLabel: "Remove",
      action: async () => {
        await api.post("/house/removeMember", { houseId: house._id, memberId });
        await loadHouse(house._id);
      },
    });
  }

  async function handleAddMember() {
    setAdding(true);
    try {
      await api.post("/house/addMember", {
        houseId: house._id,
        memberId: foundMember.id,
      });
      await loadHouse(house._id);
      closeMemberModal();
    } catch (err) {
      setMemberSearchError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleShowSecret() {
    setSecretLoading(true);
    setSecretError(null);
    setHouseSecret(null);
    setShowSecretModal(true);
    try {
      const data = await api.get("/house/getSecret", { houseId: house._id });
      setHouseSecret(data.secret);
    } catch (err) {
      setSecretError(err.message);
    } finally {
      setSecretLoading(false);
    }
  }

  function closeSecretModal() {
    setShowSecretModal(false);
    setHouseSecret(null);
    setSecretError(null);
  }

  if (error) return <p className="p-4">Error: {error}</p>;
  if (!house) return <p className="p-4">Loading…</p>;

  const user = getUser();
  const isOwner = house.owner.id === user.id;
  const houseTitle = isOwner
    ? "My House"
    : `House of ${house.owner.email.split("@")[0]}`;

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div className="d-flex align-items-center gap-2">
          <h1 className="mb-0" style={{ color: "var(--c-dark-green)" }}>
            {houseTitle}
          </h1>
          {isOwner && (
            <button
              className="btn btn-secret btn-sm"
              onClick={handleShowSecret}
              title="Show house secret"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 1 1 9.5 6.5z" />
              </svg>
            </button>
          )}
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-app"
            onClick={() => setShowMemberModal(true)}
          >
            + Add Member
          </button>
          <button className="btn btn-app" onClick={() => setShowModal(true)}>
            + Add Room
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          {selectedRoom ? (
            <>
              <div className="d-flex align-items-center gap-3 mb-3">
                <button
                  className="btn btn-app-outline btn-sm"
                  onClick={() => setSelectedRoom(null)}
                >
                  Go Back
                </button>
                <h5 className="mb-0" style={{ color: "var(--c-dark-green)" }}>
                  {selectedRoom.name}
                </h5>
              </div>
              {selectedRoom.flowers.length === 0 ? (
                <p className="text-muted">No flowers assigned to this room.</p>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 g-4">
                  {selectedRoom.flowers.map((flower) => (
                    <div key={flower._id} className="col">
                      <FlowerCard
                        flower={flower}
                        imageHeight={160}
                        onRemoveFromRoom={
                          isOwner ? handleRemoveFlowerFromRoom : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {house.rooms.length === 0 && <p>No rooms yet.</p>}
              <div className="scroll-thin pe-1 rooms-scroll">
                <div className="row row-cols-1 row-cols-sm-2 g-4">
                  {house.rooms.map((room) => (
                    <div key={room._id} className="col">
                      <RoomCard
                        room={room}
                        measurement={measurements[room._id]}
                        isOwner={isOwner}
                        onDetails={setSelectedRoom}
                        onConnect={handleOpenConnect}
                        onDelete={handleDeleteRoom}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="col-md-4">
          <MembersCard
            members={house.members}
            isOwner={isOwner}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </div>

      {connectRoom && (
        <Modal
          title={
            <>
              Connect device to <em>{connectRoom.name}</em>
            </>
          }
          onClose={closeConnectModal}
        >
          <div className="modal-body">
            {connectError && (
              <div className="alert alert-danger py-2 mb-3">{connectError}</div>
            )}
            {devices.length === 0 && !connectError && (
              <p className="text-muted mb-0">
                No devices registered to this house.
              </p>
            )}
            {devices.length > 0 && (
              <ul className="list-group">
                {devices.map((d) => {
                  const connectedHere = d.roomId === connectRoom._id;
                  const connectedElsewhere = d.roomId && !connectedHere;
                  return (
                    <li
                      key={d._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">Sensor: {d.sensorId}</div>
                        {connectedHere && (
                          <small className="text-success">
                            Connected to this room
                          </small>
                        )}
                        {connectedElsewhere && (
                          <small className="text-muted">
                            Connected to another room
                          </small>
                        )}
                      </div>
                      {connectedHere ? (
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={connecting}
                          onClick={() => handleUnassignDevice(d._id)}
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          className="btn btn-app btn-sm"
                          disabled={connecting || connectedElsewhere}
                          onClick={() => handleAssignDevice(d._id)}
                        >
                          Select
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeConnectModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {showMemberModal && (
        <Modal title="Add Member" onClose={closeMemberModal}>
          <div className="modal-body d-flex flex-column gap-3">
            <form className="d-flex gap-2" onSubmit={handleSearchMember}>
              <input
                type="email"
                className="form-control"
                placeholder="Search by email…"
                value={memberEmail}
                onChange={(e) => {
                  setMemberEmail(e.target.value);
                  setFoundMember(null);
                  setMemberSearchError(null);
                }}
                required
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-app"
                disabled={searching}
              >
                {searching ? "…" : "Search"}
              </button>
            </form>
            {memberSearchError && (
              <div className="alert alert-danger py-2 mb-0">
                {memberSearchError}
              </div>
            )}
            {foundMember && (
              <div
                className="d-flex justify-content-between align-items-center p-2 rounded"
                style={{ backgroundColor: "var(--c-light)" }}
              >
                <span>{foundMember.email}</span>
                <button
                  className="btn btn-app btn-sm"
                  onClick={handleAddMember}
                  disabled={adding}
                >
                  {adding ? "Adding…" : "Add"}
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeMemberModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {showSecretModal && (
        <Modal title="House Secret" onClose={closeSecretModal}>
          <div className="modal-body">
            {secretLoading && <p className="text-muted mb-0">Loading…</p>}
            {secretError && (
              <div className="alert alert-danger py-2 mb-0">{secretError}</div>
            )}
            {houseSecret && (
              <div>
                <code
                  className="d-block p-2 rounded"
                  style={{
                    backgroundColor: "var(--c-light)",
                    wordBreak: "break-all",
                    fontSize: "0.9rem",
                  }}
                >
                  {houseSecret}
                </code>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeSecretModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal title="Add Room" onClose={closeModal}>
          <form onSubmit={handleCreateRoom}>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                autoFocus
              />
              {roomError && (
                <div className="alert alert-danger py-2 mt-2 mb-0">
                  {roomError}
                </div>
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
