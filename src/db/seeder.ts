import "dotenv/config";
import { users } from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const db = drizzle(pool);

async function seed() {
  try {
    await db.insert(users).values([
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
      { name: "Charlie", email: "charlie@example.com" },
    ]);
    console.log("✅ Seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Failed to insert seed data:", error);
  } finally {
    await pool.end();
  }
}

seed();
