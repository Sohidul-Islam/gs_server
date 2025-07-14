import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, or, and, like, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  adminUsers,
  dropdownOptions,
  dropdowns,
  promotions,
} from "../db/schema";
import { db } from "../db/connection";
import { PromotionDataType } from "../utils/types";
import { promotionSelectFields } from "../selected_field/promotionSelectFields";

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

export const getDropdownById = async (id: number) => {
  const [dropdown] = await db
    .select()
    .from(dropdowns)
    .where(eq(dropdowns.dropdown_id, id));
  if (!dropdown) return null;

  const options = await db
    .select()
    .from(dropdownOptions)
    .where(eq(dropdownOptions.dropdown_id, id));

  return {
    ...dropdown,
    options: options.length
      ? options.map((opt) => ({
          id: opt.id,
          title: opt.title,
          status: opt.status,
          created_at: opt.created_at,
          created_by: opt.created_by,
        }))
      : undefined,
  };
};

export const getPaginatedDropdowns = async (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;

  const dropdownsList = await db
    .select()
    .from(dropdowns)
    .limit(pageSize)
    .offset(offset);

  const countResult = await db
    .select({ count: sql`COUNT(*)`.as("count") })
    .from(dropdowns);

  const total = Number(countResult[0].count);

  const dataWithOptions = await Promise.all(
    dropdownsList.map(async (dropdown: any) => {
      const options = await db
        .select()
        .from(dropdownOptions)
        .where(eq(dropdownOptions.dropdown_id, dropdown.dropdown_id));

      return {
        ...dropdown,
        options: options.length
          ? options.map((opt) => ({
              id: opt.id,
              title: opt.title,
              status: opt.status,
              created_at: opt.created_at,
              created_by: opt.created_by,
            }))
          : [],
      };
    })
  );

  return {
    data: dataWithOptions,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
// Get single dropdown option details
export const getSingleDropdownOptionById = async (id: number) => {
  const [option] = await db
    .select()
    .from(dropdownOptions)
    .where(
      and(eq(dropdownOptions.id, id), eq(dropdownOptions.status, "active"))
    );
  return option || null;
};

// Get paginated dropdown options
export const getPaginatedDropdownOptions = async (
  page: number,
  pageSize: number
) => {
  const offset = (page - 1) * pageSize;

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`.as("count") })
    .from(dropdownOptions);

  const total = countResult?.count ?? 0;

  const options = await db
    .select()
    .from(dropdownOptions)
    .limit(pageSize)
    .offset(offset);

  return {
    data: options,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export async function createPromotion(promotionData: PromotionDataType) {
  const [existing] = await db
    .select()
    .from(promotions)
    .where(eq(promotions.promotionName, promotionData.promotionName));

  if (existing) {
    throw new Error("DUPLICATE_PROMOTION");
  }

  const [typeOption] = await db
    .select()
    .from(dropdownOptions)
    .where(
      and(
        eq(dropdownOptions.id, promotionData.promotionTypeId),
        eq(dropdownOptions.status, "active")
      )
    );

  if (!typeOption) {
    throw new Error("INVALID_PROMOTION_TYPE");
  }

  await db.insert(promotions).values({
    ...promotionData,
    status: promotionData.status || "inactive",
    minimumDepositAmount: promotionData.minimumDepositAmount.toFixed(2),
    maximumDepositAmount: promotionData.maximumDepositAmount.toFixed(2),
  });

  return true;
}
export const getPromotionById = async (id: number) => {
  const [row] = await db
    .select(promotionSelectFields)
    .from(promotions)
    .leftJoin(
      dropdownOptions,
      eq(promotions.promotionTypeId, dropdownOptions.id)
    )
    .where(eq(promotions.id, id));

  if (!row) return null;

  const {
    promotionTypeId,
    promotionTypeTitle,
    promotionTypeDropdownId,
    promotionTypeStatus,
    promotionTypeCreatedBy,
    promotionTypeCreatedAt,
    ...promotion
  } = row;

  return {
    ...promotion,
    promotionType: {
      id: promotionTypeId,
      title: promotionTypeTitle,
      dropdownId: promotionTypeDropdownId,
      status: promotionTypeStatus,
      createdBy: promotionTypeCreatedBy,
      createdAt: promotionTypeCreatedAt,
    },
  };
};

export const getPaginatedPromotions = async (
  page: number,
  pageSize: number
) => {
  const offset = (page - 1) * pageSize;

  const rows = await db
    .select()
    .from(promotions)
    .leftJoin(
      dropdownOptions,
      eq(promotions.promotionTypeId, dropdownOptions.id)
    )
    .limit(pageSize)
    .offset(offset);

  const countResult = await db
    .select({ count: sql`COUNT(*)`.as("count") })
    .from(promotions);

  const total = Number(countResult[0].count);

  const data = rows.map((row) => {
    const { promotions, dropdown_options } = row;

    return {
      ...promotions,
      promotionType: dropdown_options
        ? {
            id: dropdown_options.id,
            title: dropdown_options.title,
            dropdownId: dropdown_options.dropdown_id,
            status: dropdown_options.status,
            createdBy: dropdown_options.created_by,
            createdAt: dropdown_options.created_at,
          }
        : null,
    };
  });

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
