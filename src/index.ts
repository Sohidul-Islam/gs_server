import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import type { ConnectionOptions } from "mysql2";
import process from "process";
import express from "express";
import mysql from "mysql2/promise";

// Ensure process.env.DATABASE_URL is defined and of correct type
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(pool);

// Test DB connection
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection successful!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Optionally exit if DB is critical
  }
})();

const app = express();
app.use(express.json());

// User routes (to be implemented in controllers/routes)
import userRouter from "./routes/user.route";
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
