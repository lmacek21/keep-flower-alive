const jwt = require("jsonwebtoken");

function superUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  if (req.user.role !== "superuser") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

module.exports = superUser;
