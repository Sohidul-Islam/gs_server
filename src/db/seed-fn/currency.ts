import { sql } from "drizzle-orm";
import { db } from "../connection";
import { currencies } from "../schema";
// @ts-ignore
import countryJson from "../../assets/countries.json";

type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type Country = {
  id: number;
  name: string;
  isoAlpha2: string;
  isoAlpha3: string;
  isoNumeric: number;
  currency: Currency;
  flag?: string; // Optional, since it's incomplete in your example
};

const countryData = countryJson as Country[];

export const seedCurrency = async () => {
  try {
    // insert country data

    console.log("Formating currency data...");

    // const currencyData = countryData.map()

    // await db.insert(currencies).values({

    // })

    //   .insert(currencies)
    //   .values([
    //     { code: "USD", name: "US Dollar", country: "USA", symbol: "$" },
    //     { code: "EUR", name: "Euro", country: "France", symbol: "€" },
    //     { code: "INR", name: "Indian Rupee", country: "India", symbol: "₹" },
    //   ])
    //   .onDuplicateKeyUpdate({
    //     set: {
    //       code: sql`values(${currency.code})`,
    //       name: sql`values(${currency.name})`,
    //     },
    //   });

    console.log("✅ Currency seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Failed to insert Currency seed data:", error);
  }
};
