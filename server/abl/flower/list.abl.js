const FlowerDao = require("../../dao/flower.dao");

async function listFlower(req, res) {
  try {
    const flowers = await FlowerDao.getAll();
    return res.status(200).json(flowers);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = listFlower;
