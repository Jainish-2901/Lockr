const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.error("❌ No Authorization header found");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract token after "Bearer "
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    console.log("✅ Authenticated user:", req.user); // debug log
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired, please log in again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Token is invalid" });
    }
    return res.status(401).json({ msg: "Authorization error" });
  }
};
