import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../schema";
import mysql from "mysql2/promise";
import { db } from "../connection";

export const seedUsers = async () => {
  try {
    await db.insert(users).values([
      {
        username: "alice123",
        fullname: "Alice Smith",
        phone: "1234567890",
        email: "alice@example.com",
        password: "hashedpassword1",
        currency_id: 1,
        refer_code: "REFALICE",
        isAgreeWithTerms: true,
      },
      {
        username: "bob456",
        fullname: "Bob Brown",
        phone: "2345678901",
        email: "bob@example.com",
        password: "hashedpassword2",
        currency_id: 2,
        refer_code: "REFBOB",
        isAgreeWithTerms: true,
      },
    ]);
    console.log("✅ User seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Failed to insert User seed data:", error);
  }
};
