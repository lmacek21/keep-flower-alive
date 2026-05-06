const ajv = require("../../utils/ajv.util");
const HouseDao = require("../../dao/house.dao");
const RoomDao = require("../../dao/room.dao");
const schema = require("../../schema/house/delete.schema");

const validate = ajv.compile(schema);

async function deleteHouse(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const deletedHouse = await HouseDao.deleteById(body.id);
    if (!deletedHouse) {
      return res.status(404).json({ error: "House not found" });
    }
    await RoomDao.deleteByHouseId(body.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = deleteHouse;
