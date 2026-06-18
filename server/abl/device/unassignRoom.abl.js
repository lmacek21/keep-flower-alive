const ajv = require("../../utils/ajv.util");
const DeviceDao = require("../../dao/device.dao");
const RoomDao = require("../../dao/room.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/device/unassignRoom.schema");

const validate = ajv.compile(schema);

async function unassignRoom(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res.status(400).json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const device = await DeviceDao.getById(body.id);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    if (!device.roomId) {
      return res.status(400).json({ error: "Device is not assigned to any room" });
    }
    const room = await RoomDao.getById(device.roomId);
    if (room && !(await isOwner(room.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await DeviceDao.unassignRoom(body.id);
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

module.exports = unassignRoom;
