import { eq, sql } from "drizzle-orm";
import { dropdownOptions, promotions } from "../db/schema";
import { db } from "../db/connection";
import { promotionPublicSelectFields } from "../selected_field/promotionSelectFields";

export const getPublicPromotionById = async (id: number) => {
  const [row] = await db
    .select(promotionPublicSelectFields)
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
    promotionTypeCreatedAt,
    ...promotion
  } = row;

  return {
    id: row.id,
    promotionName: row.promotionName,
    promotionTypeId: row.promotionTypeId,
    dateRange: row.dateRange,
    minimumDepositAmount: row.minimumDepositAmount,
    maximumDepositAmount: row.maximumDepositAmount,
    turnoverMultiply: row.turnoverMultiply,
    bannerImg: row.bannerImg,
    bonus: row.bonus,
    description: row.description,
    createdAt: row.createdAt,

    // Merge promotion type info from aliased fields
    promotionType: promotionTypeTitle
      ? {
          id: promotionTypeId,
          title: promotionTypeTitle,
          dropdownId: promotionTypeDropdownId,
          createdAt: promotionTypeCreatedAt,
        }
      : null,
  };
};

export const getPublicPaginatedPromotions = async (
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
      id: promotions.id,
      promotionName: promotions.promotionName,
      promotionTypeId: promotions.promotionTypeId,
      dateRange: promotions.dateRange,
      minimumDepositAmount: promotions.minimumDepositAmount,
      maximumDepositAmount: promotions.maximumDepositAmount,
      turnoverMultiply: promotions.turnoverMultiply,
      bannerImg: promotions.bannerImg,
      bonus: promotions.bonus,
      description: promotions.description,
      createdAt: promotions.createdAt,

      // Merge promotion type info from aliased fields
      promotionType: dropdown_options?.title
        ? {
            id: dropdown_options.id,
            title: dropdown_options.title,
            dropdownId: dropdown_options.dropdown_id,
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
