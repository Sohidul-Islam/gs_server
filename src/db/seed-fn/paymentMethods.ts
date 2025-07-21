import { paymentMethods } from "../schema/paymentMethods";
import { db } from "../connection";
import { sql } from "drizzle-orm";

export async function seedPaymentMethodTypes() {
  const types = [
    { id:1 ,name: "Local bank" },
    { id:2 ,name: "E wallet" },
    { id:3 ,name: "Crypto" },
    { id:4 ,name: "International" },
  ];

    try {
      await db.insert(paymentMethods).values(types).onDuplicateKeyUpdate({
        set:{
          id: sql`values(${paymentMethods.id})`,
          name: sql`values(${paymentMethods.name})`
        }
      });
      console.log("✅ Payment method type seeded successfully!")
    } catch (e) {
      // Ignore duplicate entry errors
    }
  
} 