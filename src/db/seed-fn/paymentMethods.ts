import { paymentMethods } from "../schema/paymentMethods";
import { db } from "../connection";
import { sql } from "drizzle-orm";
import { paymentMethodTypes } from "../schema";

export async function seedPaymentMethods() {
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
      console.log("✅ Payment methods seeded successfully!")
    } catch (e) {
      // Ignore duplicate entry errors
    }
  
} 



export async function seedPaymentMethodTypes() {
  const types = [
    { id:1 ,name: "Agent",paymentMethodId: 2 },
    { id:2 ,name: "Personal" , paymentMethodId: 2},
    { id:3 ,name: "USDT", paymentMethodId: 3},
    { id:4, name: "Credit Card", paymentMethodId: 4 },
    {id: 5 , name: "Debit Card", paymentMethodId: 4},
  ];

    try {
      await db.insert(paymentMethodTypes).values(types).onDuplicateKeyUpdate({
        set:{
          id: sql`values(${paymentMethodTypes.id})`,
          name: sql`values(${paymentMethodTypes.name})`
        }
      });
      console.log("✅ Payment method type seeded successfully!")
    } catch (e) {
      // Ignore duplicate entry errors
    }
  
} 