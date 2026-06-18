const ajv = require("../../utils/ajv.util");
const UserDao = require("../../dao/user.dao");
const schema = require("../../schema/user/find.schema");

const validate = ajv.compile(schema);

async function findUser(req, res) {
  const query = req.query;
  if (!validate(query)) {
    return res.status(400).json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const user = await UserDao.getByEmail(query.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ error: "You cannot add yourself as a member" });
    }
    return res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

module.exports = findUser;
