const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ajv = require("../../utils/ajv.util");
const UserDao = require("../../dao/user.dao");
const HouseDao = require("../../dao/house.dao");
const schema = require("../../schema/user/register.schema");

const validate = ajv.compile(schema);

async function register(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const existing = await UserDao.getByEmail(body.email);
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await UserDao.create({
      email: body.email,
      password: hashedPassword,
    });
    let house;
    try {
      house = await HouseDao.create({
        owner: { id: user._id, email: user.email },
        members: [],
        secret: crypto.randomBytes(24).toString("hex"),
      });
    } catch (houseErr) {
      await UserDao.deleteById(user._id);
      throw houseErr;
    }
    return res
      .status(200)
      .json({ id: user._id, email: user.email, houseId: house._id });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = register;
