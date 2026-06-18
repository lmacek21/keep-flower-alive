const ajv = require("../../utils/ajv.util");
const HouseDao = require("../../dao/house.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/house/getSecret.schema");

const validate = ajv.compile(schema);

async function getSecret(req, res) {
  const query = req.query;
  if (!validate(query)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    if (!(await isOwner(query.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const house = await HouseDao.getByIdWithSecret(query.houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    return res.status(200).json({ secret: house.secret });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = getSecret;
