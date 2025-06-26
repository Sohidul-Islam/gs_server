import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findAdminByUsernameOrEmail,
  createAdmin,
  getAdminById,
} from "../models/admin.model";
import { db } from "../db/connection";
import { adminUsers } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyJwt } from "../utils/jwt";

export const adminRegistration = async (req: Request, res: Response) => {
  try {
    const { username, fullname, phone, email, password, role } = req.body;
    if (!username || !fullname || !phone || !email || !password || !role) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }
    const existing =
      (await findAdminByUsernameOrEmail(username)) ||
      (await findAdminByUsernameOrEmail(email));
    if (existing) {
      return res
        .status(409)
        .json({ status: false, message: "Admin user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await createAdmin({
      username,
      fullname,
      phone,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      status: true,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to register admin" });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { userNameOrEmailorPhone, password } = req.body;
    if (!userNameOrEmailorPhone || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing username/email/phone or password",
      });
    }
    const admin = await findAdminByUsernameOrEmail(userNameOrEmailorPhone);
    if (!admin || typeof admin.password !== "string") {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }
    const isMatch = password === admin.password;
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }

    if (admin.id)
      await db
        .update(adminUsers)
        .set({ isLoggedIn: true })
        .where(eq(adminUsers.id, admin.id));

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    return res.json({
      status: true,
      message: "Login successful",
      data: admin,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to login" });
  }
};

// Middleware to extract admin from JWT
const getAdminFromToken = async (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyJwt(token);
    if (!decoded?.id) return null;
    const admin = await getAdminById(decoded.id);
    return admin;
  } catch {
    return null;
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  const admin = await getAdminFromToken(req);
  if (!admin) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  await db
    .update(adminUsers)
    .set({ isLoggedIn: false })
    .where(eq(adminUsers.id, admin.id));
  return res.json({ status: true, message: "Logout successful" });
};

export const adminProfile = async (req: Request, res: Response) => {
  const admin = await getAdminFromToken(req);
  if (!admin) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  return res.json({ status: true, data: admin });
};
