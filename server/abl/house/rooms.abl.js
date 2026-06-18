const HouseDao = require("../../dao/house.dao");
const RoomDao = require("../../dao/room.dao");

async function getRooms(req, res) {
  try {
    const house = await HouseDao.getByOwnerId(req.user.id);
    if (!house) {
      return res.status(404).json({ error: "No owned house found" });
    }
    const rooms = await RoomDao.getByHouseId(house._id);
    return res.status(200).json(rooms);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = getRooms;
