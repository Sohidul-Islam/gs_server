import "dotenv/config";
import { db, pool } from "./connection";

import { seedUsers } from "./seed-fn/users";
import { seedCurrency } from "./seed-fn/currency";
import { seedAdminUsers } from "./seed-fn/adminUser";
import { seedDropdowns } from "./seed-fn/dropdowns";
import { seedAccountTypes } from "./seed-fn/accountTypes";
import { seedAccounts } from "./seed-fn/accounts";

async function seed() {
  try {
    // Seed currency
    await seedCurrency();
    // seed users
    await seedUsers();
    // seed admin users
    await seedAdminUsers();
    // seed account types
    await seedAccountTypes(db);
    // seed accounts
    await seedAccounts(db);
    // seed dropdown names
    await seedDropdowns();
  } catch (error) {
    console.error("❌ Failed to insert seed data:", error);
  } finally {
    await pool.end();
  }
}

seed();
