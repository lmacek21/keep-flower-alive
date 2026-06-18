const ajv = require("../../utils/ajv.util");
const FlowerDao = require("../../dao/flower.dao");
const schema = require("../../schema/flower/create.schema");

const validate = ajv.compile(schema);

async function createFlower(req, res) {
  const body = req.body;
  if (body.minTemp !== undefined) body.minTemp = Number(body.minTemp);
  if (body.maxTemp !== undefined) body.maxTemp = Number(body.maxTemp);
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const flower = await FlowerDao.create(body);
    return res.status(200).json(flower);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = createFlower;
