const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

// View own profile
router.get("/me", authenticateJWT, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).send("Access denied");

  const db = req.app.locals.db;
  const profile = await db.get(
    `SELECT u.name, u.email, s.course, s.enrollment_date
     FROM users u JOIN students s ON u.id = s.user_id
     WHERE u.id = ?`,
    [req.user.userId]
  );

  res.json(profile);
});

// Update own profile
router.put("/me", authenticateJWT, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).send("Access denied");

  const db = req.app.locals.db;
  const { name, email, course } = req.body;

  await db.run("UPDATE users SET name=?, email=? WHERE id=?", [
    name,
    email,
    req.user.userId,
  ]);
  await db.run("UPDATE students SET course=? WHERE user_id=?", [
    course,
    req.user.userId,
  ]);

  res.send("Profile updated");
});

module.exports = router;
