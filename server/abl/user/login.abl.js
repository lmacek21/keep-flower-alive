const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ajv = require("../../utils/ajv.util");
const UserDao = require("../../dao/user.dao");
const schema = require("../../schema/user/login.schema");

const validate = ajv.compile(schema);

async function login(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const user = await UserDao.getByEmail(body.email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = login;
