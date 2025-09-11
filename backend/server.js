const express = require("express");
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
let db;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create tables if not exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('admin','student'))
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course TEXT,
        enrollment_date TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    // Attach db to app for routes
    app.locals.db = db;

    // Routes
    app.use("/auth", authRoutes);
    app.use("/student", studentRoutes);
    app.use("/admin", adminRoutes);

    app.listen(3001, () => {
      console.log("Server running at http://localhost:3001");
    });
  } catch (e) {
    console.error("DB Error:", e.message);
  }
};

initializeDBAndServer();
