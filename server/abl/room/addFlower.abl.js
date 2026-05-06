const ajv = require("../../utils/ajv.util");
const RoomDao = require("../../dao/room.dao");
const schema = require("../../schema/room/addFlower.schema");

const validate = ajv.compile(schema);

async function addFlower(req, res) {
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

    const flowerId = String(body.flowerId);
    const hasFlower = (room.flowers || []).some((id) => String(id) === flowerId);
    if (!hasFlower) {
      room.flowers = room.flowers || [];
      room.flowers.push(body.flowerId);
    }

    const updated = await RoomDao.save(room);
    console.log("ROOM AFTER ADD:", updated);
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = addFlower;
