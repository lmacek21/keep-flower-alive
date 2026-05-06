const HouseDao = require("../../dao/house.dao");

async function listHouse(req, res) {
  try {
    const houses = await HouseDao.getAll();
    return res.status(200).json(houses);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = listHouse;
