import "dotenv/config";
import { db, pool } from "./connection";
import { currency } from "./schema";
import { seedUsers } from "./seed-fn/users";
import { seedCurrency } from "./seed-fn/currency";

async function seed() {
  try {
    // Seed currency
    await seedCurrency();
    // seed users
    await seedUsers();
    // Seed users (example, currency_id: 1 for USD)
  } catch (error) {
    console.error("❌ Failed to insert seed data:", error);
  } finally {
    await pool.end();
  }
}

seed();
