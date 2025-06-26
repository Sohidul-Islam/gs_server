import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, or } from "drizzle-orm";
import { adminUsers } from "../db/schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const db = drizzle(pool);

export const findAdminByUsernameOrEmail = async (usernameOrEmail: string) => {
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(
      or(
        eq(adminUsers.username, usernameOrEmail),
        eq(adminUsers.email, usernameOrEmail),
        eq(adminUsers.phone, usernameOrEmail)
      )
    );
  return admin;
};

export const createAdmin = async (data: {
  username: string;
  fullname: string;
  phone: string;
  email: string;
  password: string;
  role: "admin" | "superAgent" | "agent" | "superAffiliate" | "affiliate";
}) => {
  const [admin] = await db.insert(adminUsers).values({
    ...data,
  });
  return admin;
};

export const getAdminById = async (id: number) => {
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id));
  return admin;
};
