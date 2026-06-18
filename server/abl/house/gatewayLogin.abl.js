const jwt = require("jsonwebtoken");
const ajv = require("../../utils/ajv.util");
const HouseDao = require("../../dao/house.dao");
const schema = require("../../schema/house/gatewayLogin.schema");

const validate = ajv.compile(schema);

async function gatewayLogin(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const house = await HouseDao.getBySecret(body.secret);
    if (!house) {
      return res.status(401).json({ error: "Invalid house secret" });
    }
    const token = jwt.sign(
      { houseId: house._id, type: "gateway" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = gatewayLogin;
