const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../middleware/auth");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const db = req.app.locals.db;
  const { name, email, password, role, course } = req.body;

  try {
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, role]
    );

    if (role === "student") {
      await db.run(
        "INSERT INTO students (user_id, course, enrollment_date) VALUES (?,?,date('now'))",
        [result.lastID, course]
      );
    }

    res.send("User registered successfully");
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// Login
router.post("/login", async (req, res) => {
  const db = req.app.locals.db;
  const { email, password } = req.body;

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(400).send("Invalid user");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

module.exports = router;
