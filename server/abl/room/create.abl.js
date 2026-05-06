const ajv = require("../../utils/ajv.util");
const RoomDao = require("../../dao/room.dao");
const HouseDao = require("../../dao/house.dao");
const schema = require("../../schema/room/create.schema");

const validate = ajv.compile(schema);

async function createRoom(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const house = await HouseDao.getById(body.houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    const room = await RoomDao.create(body);
    return res.status(200).json(room);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = createRoom;
