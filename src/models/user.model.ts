import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, or } from "drizzle-orm";
import { users } from "../db/schema/users";
import bcrypt from "bcryptjs";
import { currency } from "../db/schema";

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

export const findUserByUsernameOrEmail = async (usernameOrEmail: string) => {
  const [user] = await db
    .select()
    .from(users)
    // .leftJoin(currency, eq(currency.id, users.currency_id))
    .where(
      or(
        eq(users.username, usernameOrEmail),
        eq(users.email, usernameOrEmail),
        eq(users.phone, usernameOrEmail)
      )
    );
  return user;
};

export const createUser = async (data: {
  username: string;
  fullname: string;
  phone: string;
  email: string;
  password: string;
  currency_id: number;
  refer_code?: string;
  isAgreeWithTerms: boolean;
}) => {
  // const hashedPassword = await bcrypt.hash(data.password, 10);
  const [user] = await db.insert(users).values({
    ...data,
    // password: hashedPassword,
  });

  return user;
};
