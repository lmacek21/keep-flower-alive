const ajv = require("../../utils/ajv.util");
const FlowerDao = require("../../dao/flower.dao");
const schema = require("../../schema/flower/delete.schema");

const validate = ajv.compile(schema);

async function deleteFlower(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const flower = await FlowerDao.deleteById(body.id);
    if (!flower) {
      return res.status(404).json({ error: "Flower not found" });
    }
    return res.status(200).json(flower);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = deleteFlower;
