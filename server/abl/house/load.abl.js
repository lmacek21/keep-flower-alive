const ajv = require("../../utils/ajv.util");
const HouseDao = require("../../dao/house.dao");
const RoomDao = require("../../dao/room.dao");
const schema = require("../../schema/house/load.schema");

const validate = ajv.compile(schema);

async function loadHouse(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const house = await HouseDao.getById(body.id);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    const rooms = await RoomDao.getByHouseIdWithFlowers(house._id);
    return res.status(200).json({ ...house.toObject(), rooms });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = loadHouse;
