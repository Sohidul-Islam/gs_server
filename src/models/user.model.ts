import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, or, and, like } from "drizzle-orm";
import { users } from "../db/schema/users";
import bcrypt from "bcryptjs";
import { currency } from "../db/schema";
import { sql } from "drizzle-orm";

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

export interface UserFilters {
  playerId?: number;
  phone?: string;
  status?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export const getUsersWithFilters = async (filters: UserFilters) => {
  const { playerId, phone, status, keyword, page = 1, pageSize = 10 } = filters;
  const whereClauses = [];
  if (playerId) whereClauses.push(eq(users.id, playerId));
  if (phone) whereClauses.push(eq(users.phone, phone));
  if (status) whereClauses.push(eq(users.status as any, status));
  if (keyword) {
    const kw = `%${keyword}%`;
    whereClauses.push(
      or(
        like(users.username, `%${kw}%`),
        like(users.fullname, `%${kw}%`),
        like(users.email, `%${kw}%`),
        like(users.phone, `%${kw}%`)
      )
    );
  }
  const where = whereClauses.length ? and(...whereClauses) : undefined;
  // Get total count
  const total = await db
    .select({ count: sql`COUNT(*)` })
    .from(users)
    .where(where)
    .then((rows) => Number(rows[0]?.count || 0));
  // Get paginated data
  const data = await db
    .select()
    .from(users)
    .where(where)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const totalPages = Math.ceil(total / pageSize);
  return {
    total,
    data,
    pagination: {
      page,
      pageSize,
      totalPages,
      total,
    },
  };
};
