const ajv = require("../../utils/ajv.util");
const HouseDao = require("../../dao/house.dao");
const schema = require("../../schema/house/create.schema");

const validate = ajv.compile(schema);

async function createHouse(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const house = await HouseDao.create({ name: body.name, ownerId: "", members: [] });
    return res.status(200).json(house);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = createHouse;
