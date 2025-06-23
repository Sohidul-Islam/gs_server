import { users } from "../db/schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const db = drizzle(pool);

export const getUsers = async () => {
  return db.select().from(users);
};

export const insertUser = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const result = await db.insert(users).values({ name, email });
  // Fetch the inserted user (assuming auto-increment id)
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};
