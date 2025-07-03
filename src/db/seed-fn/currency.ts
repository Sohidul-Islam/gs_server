import { sql } from "drizzle-orm";
import { db } from "../connection";
import { currency } from "../schema";

export const seedCurrency = async () => {
  try {
    await db
      .insert(currency)
      .values([
        { code: "USD", name: "US Dollar", country: "USA", symbol: "$" },
        { code: "EUR", name: "Euro", country: "France", symbol: "€" },
        { code: "INR", name: "Indian Rupee", country: "India", symbol: "₹" },
      ])
      .onDuplicateKeyUpdate({
        set: {
          code: sql`values(${currency.code})`,
          name: sql`values(${currency.name})`,
        },
      });

    console.log("✅ Currency seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Failed to insert Currency seed data:", error);
  }
};
