import { db } from "../connection";
import { dropdowns } from "../schema";

export const seedDropdowns = async () => {
  try {
    await db
      .insert(dropdowns)
      .values([
        { name: "Promotion Type" },
        { name: "Game Type" },
        { name: "Bonus Type" },
      ]);
    console.log("✅ Dropdowns seeded");
  } catch (err) {
    console.error("❌ Failed to seed dropdowns:", err);
  }
};
