import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, or, and, like } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { adminUsers } from "../db/schema";
import { db } from "../db/connection";

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
  country?: string;
  city?: string;
  street?: string;
  minTrx?: string;
  maxTrx?: string;
  currency?: number;
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

export interface AdminFilters {
  role?: "admin" | "superAgent" | "agent" | "superAffiliate" | "affiliate";
  page?: number;
  pageSize?: number;
  searchKeyword?: string;
}

export const getAdminsWithFilters = async (filters: AdminFilters) => {
  const { role, page = 1, pageSize = 10, searchKeyword } = filters;
  const whereClauses = [];
  if (role) whereClauses.push(eq(adminUsers.role, role));
  if (searchKeyword) {
    const kw = `%${searchKeyword}%`;
    whereClauses.push(
      or(
        like(adminUsers.username, kw),
        like(adminUsers.fullname, kw),
        like(adminUsers.email, kw),
        like(adminUsers.phone, kw)
      )
    );
  }
  const where = whereClauses.length ? and(...whereClauses) : undefined;
  // Get total count
  const total = await db
    .select({ count: sql`COUNT(*)` })
    .from(adminUsers)
    .where(where)
    .then((rows) => Number(rows[0]?.count || 0));
  // Get paginated data
  const data = await db
    .select()
    .from(adminUsers)
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

export const updateAdmin = async (
  id: number,
  data: Partial<{
    username: string;
    fullname: string;
    phone: string;
    email: string;
    password: string;
    role: "admin" | "superAgent" | "agent" | "superAffiliate" | "affiliate";
    country?: string;
    city?: string;
    street?: string;
    minTrx?: string;
    maxTrx?: string;
    currency?: number;
    isLoggedIn?: boolean;
  }>
) => {
  await db.update(adminUsers).set(data).where(eq(adminUsers.id, id));
  return getAdminById(id);
};
