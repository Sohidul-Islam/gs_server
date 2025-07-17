import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import type { ConnectionOptions } from "mysql2";
import process from "process";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { pool } from "./db/connection";
import { Request, Response, NextFunction } from "express";

// Routes import
import userRouter from "./routes/user.route";
import adminRouter from "./routes/admin.route";
import countryRouter from "./routes/country.route";
import accountRoutes from "./routes/account.route";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./utils/swagger";
// Ensure process.env.DATABASE_URL is defined and of correct type
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

// Test DB connection
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection successful!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Optionally exit if DB is critical
  }
})();

const app = express();

// CORS configuration
app.use(cors());
// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? [
//             "https://fashionglory-gaming.vercel.app",
//             "https://fashionglory-gaming.vercel.app/",
//           ] // Replace with your actual domain
//         : [
//             "http://localhost:3000",
//             "http://localhost:3001",
//             "http://localhost:5173",
//             "http://127.0.0.1:5173",
//             "https://fashionglory-gaming.vercel.app",
//             "https://fashionglory-gaming.vercel.app/",
//           ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   })
// );

app.use(express.json());

// User routes (to be implemented in controllers/routes)

app.use("/api/users", userRouter);

// Admin routes (to be implemented in controllers/routes)

app.use("/api/admin", adminRouter);

app.use("/api/countries", countryRouter);
app.use("/api/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Fashion Glory API!");
});

// Global error handler
app.use(errorHandler);
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
