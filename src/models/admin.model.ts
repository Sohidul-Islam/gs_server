import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, or, and, like, inArray } from "drizzle-orm";
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
  createdBy?: number;
  status?: "active" | "inactive";
  refCode?: string;
}) => {
  const [admin] = await db.insert(adminUsers).values({
    ...data,
    createdBy: data?.createdBy,
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

export type AdminRole =
  | "admin"
  | "superAgent"
  | "agent"
  | "superAffiliate"
  | "affiliate";

export interface AdminFilters {
  role?: AdminRole | AdminRole[]; // Accepts single role or array of roles
  roleList?: AdminRole[];
  page?: number;
  pageSize?: number;
  searchKeyword?: string;
  status?: "active" | "inactive";
}

export const getAdminsWithFilters = async (filters: AdminFilters) => {
  const {
    role,
    roleList,
    page = 1,
    pageSize = 10,
    searchKeyword,
    status,
  } = filters;
  const whereClauses = [];
  if (role)
    whereClauses.push(
      Array.isArray(role)
        ? role.length > 0 && inArray(adminUsers.role, role)
        : eq(adminUsers.role, role)
    );

  if (roleList && roleList?.length > 0) {
    whereClauses.push(inArray(adminUsers.role, [...roleList]));
  }

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
  if (status) {
    whereClauses.push(eq(adminUsers.status, status));
  }
  // Filter out any falsey (e.g., false) values from whereClauses to avoid boolean in and()
  const filteredWhereClauses = whereClauses.filter(
    (clause): clause is Exclude<typeof clause, boolean | undefined> =>
      Boolean(clause)
  );
  const where = filteredWhereClauses.length
    ? and(...filteredWhereClauses)
    : undefined;
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
    refCode?: string;
    status?: "active" | "inactive";
  }>
) => {
  await db.update(adminUsers).set(data).where(eq(adminUsers.id, id));
  return getAdminById(id);
};

export const deleteAdmin = async (id: number) => {
  const result = await db.delete(adminUsers).where(eq(adminUsers.id, id));
  return result;
};
