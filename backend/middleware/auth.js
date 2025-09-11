const jwt = require("jsonwebtoken");
const jwtSecret = "MY_SECRET"; // store in .env later

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Missing token");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user; // { userId, role }
    next();
  });
};

module.exports = { authenticateJWT, jwtSecret };
