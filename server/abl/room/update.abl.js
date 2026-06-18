const ajv = require("../../utils/ajv.util");
const RoomDao = require("../../dao/room.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/room/update.schema");

const validate = ajv.compile(schema);

async function updateRoom(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  const { id, ...updates } = body;
  try {
    const room = await RoomDao.getById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (!(await isOwner(room.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await RoomDao.update(id, updates);
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = updateRoom;
