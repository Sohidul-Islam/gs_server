import "dotenv/config";
import { db, pool } from "./connection";
import { currency } from "./schema";
import { seedUsers } from "./seed-fn/users";
import { seedCurrency } from "./seed-fn/currency";
import { seedAdminUsers } from "./seed-fn/adminUser";

async function seed() {
  try {
    // Seed currency
    await seedCurrency();
    // seed users
    await seedUsers();
    // seed admin users
    await seedAdminUsers();
  } catch (error) {
    console.error("❌ Failed to insert seed data:", error);
  } finally {
    await pool.end();
  }
}

seed();
