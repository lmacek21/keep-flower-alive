const ajv = require("../../utils/ajv.util");
const RoomDao = require("../../dao/room.dao");
const schema = require("../../schema/room/removeFlower.schema");

const validate = ajv.compile(schema);

async function removeFlower(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const room = await RoomDao.removeFlower(body.roomId, body.flowerId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    return res.status(200).json(room);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = removeFlower;
