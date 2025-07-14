import { db } from "../connection";
import { dropdowns } from "../schema";
import { eq } from "drizzle-orm";

export const seedDropdowns = async () => {
  try {
    const existing = await db
      .select()
      .from(dropdowns)
      .where(eq(dropdowns.name, "Promotion Type"));

    if (existing.length === 0) {
      await db.insert(dropdowns).values([{ name: "Promotion Type" }]);
      console.log("✅ Dropdowns seeded");
    } else {
      console.log("⚠️ 'Promotion Type' already exists, skipping insert");
    }
  } catch (err) {
    console.error("❌ Failed to seed dropdowns:", err);
  }
};
