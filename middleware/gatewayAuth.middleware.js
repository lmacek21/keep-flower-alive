const jwt = require("jsonwebtoken");

function gatewayAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== "gateway") {
      return res.status(401).json({ error: "Invalid token type" });
    }
    req.gateway = payload;
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  next();
}

module.exports = gatewayAuth;
