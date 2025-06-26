import "dotenv/config";
import { adminUsers } from "../schema";
import { db } from "../connection";

export const seedAdminUsers = async () => {
  try {
    await db.insert(adminUsers).values([
      {
        username: "admin1",
        fullname: "Admin One",
        phone: "1000000001",
        email: "admin1@example.com",
        password: "adminpass1",
        role: "admin",
      },
      {
        username: "superagent1",
        fullname: "Super Agent One",
        phone: "1000000002",
        email: "superagent1@example.com",
        password: "superagentpass1",
        role: "superAgent",
      },
      {
        username: "agent1",
        fullname: "Agent One",
        phone: "1000000003",
        email: "agent1@example.com",
        password: "agentpass1",
        role: "agent",
      },
      {
        username: "superaffiliate1",
        fullname: "Super Affiliate One",
        phone: "1000000004",
        email: "superaffiliate1@example.com",
        password: "superaffiliatepass1",
        role: "superAffiliate",
      },
      {
        username: "affiliate1",
        fullname: "Affiliate One",
        phone: "1000000005",
        email: "affiliate1@example.com",
        password: "affiliatepass1",
        role: "affiliate",
      },
    ]);
    console.log("✅ AdminUser seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Failed to insert AdminUser seed data:", error);
  }
};
