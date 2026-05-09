const ajv = require("../../utils/ajv.util");
const DeviceDao = require("../../dao/device.dao");
const RoomDao = require("../../dao/room.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/device/assignRoom.schema");

const validate = ajv.compile(schema);

async function assignRoom(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const room = await RoomDao.getById(body.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (!(await isOwner(room.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const device = await DeviceDao.assignRoom(body.id, body.roomId);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    return res.status(200).json(device);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = assignRoom;
