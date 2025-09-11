const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

// View all students
router.get("/students", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");

  const db = req.app.locals.db;
  const students = await db.all(`
    SELECT u.id, u.name, u.email, s.course, s.enrollment_date
    FROM users u JOIN students s ON u.id = s.user_id
  `);
  res.json(students);
});

// Edit student
router.put("/students/:id", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");

  const db = req.app.locals.db;
  const { name, email, course } = req.body;

  await db.run("UPDATE users SET name=?, email=? WHERE id=?", [
    name,
    email,
    req.params.id,
  ]);
  await db.run("UPDATE students SET course=? WHERE user_id=?", [
    course,
    req.params.id,
  ]);

  res.send("Student updated");
});

// Delete student
router.delete("/students/:id", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");

  const db = req.app.locals.db;
  await db.run("DELETE FROM users WHERE id=?", [req.params.id]);
  res.send("Student deleted");
});

module.exports = router;
