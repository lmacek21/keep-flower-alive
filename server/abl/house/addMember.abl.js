const ajv = require("../../utils/ajv.util");
const HouseDao = require("../../dao/house.dao");
const UserDao = require("../../dao/user.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/house/addMember.schema");

const validate = ajv.compile(schema);

async function addMember(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    if (!(await isOwner(body.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await UserDao.getById(body.memberId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const house = await HouseDao.addMember(body.houseId, { id: user._id, email: user.email });
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    return res.status(200).json(house);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = addMember;
