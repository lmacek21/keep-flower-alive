const ajv = require("../../utils/ajv.util");
const RoomDao = require("../../dao/room.dao");
const MeasurementDao = require("../../dao/measurement.dao");
const DeviceDao = require("../../dao/device.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/room/delete.schema");

const validate = ajv.compile(schema);

async function deleteRoom(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const room = await RoomDao.getById(body.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (!(await isOwner(room.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await RoomDao.deleteById(body.id);
    await Promise.all([
      MeasurementDao.deleteByRoomId(body.id),
      DeviceDao.unassignByRoomId(body.id),
    ]);
    return res.status(200).json(room);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = deleteRoom;
