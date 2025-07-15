import "dotenv/config";
import { db, pool } from "./connection";

import { seedUsers } from "./seed-fn/users";
import { seedCurrency } from "./seed-fn/currency";
import { seedAdminUsers } from "./seed-fn/adminUser";
import { seedDropdowns } from "./seed-fn/dropdowns";

async function seed() {
  try {
    // Seed currency
    await seedCurrency();
    // seed users
    await seedUsers();
    // seed admin users
    await seedAdminUsers();
    // seed dropdown names
    await seedDropdowns();
  } catch (error) {
    console.error("❌ Failed to insert seed data:", error);
  } finally {
    await pool.end();
  }
}

seed();
