import { Request, Response } from "express";
import {
  getUsersWithFilters,
  createUser,
  findUserByUsernameOrEmail,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
} from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UAParser from "ua-parser-js";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateUniqueRefCode } from "../utils/refCode";
import { findUserByReferCode } from "../models/user.model";
import { findAdminByRefCode } from "../models/admin.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersWithFilters({});
    return res.json({ status: true, users });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch users" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      fullname,
      phone,
      email,
      password,
      currency_id,
      refer_code,
      isAgreeWithTerms,
      createdBy,
    } = req.body;
    if (
      !username ||
      !fullname ||
      !phone ||
      !email ||
      !password ||
      !currency_id ||
      typeof isAgreeWithTerms !== "boolean"
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }
    const existing =
      (await findUserByUsernameOrEmail(username)) ||
      (await findUserByUsernameOrEmail(email));
    if (existing) {
      return res
        .status(409)
        .json({ status: false, message: "User already exists" });
    }
    // Generate unique refer_code for this user
    const uniqueReferCode = await generateUniqueRefCode("user");
    // If refer_code is provided, find the referring user
    let referred_by = undefined;
    let referred_by_admin_user = undefined;
    if (refer_code) {
      const referringUser = await findUserByReferCode(refer_code);
      if (referringUser && referringUser.id) {
        referred_by = referringUser.id;
      } else {
        const referringAdmin = await findAdminByRefCode(refer_code);
        if (referringAdmin && referringAdmin?.id) {
          referred_by_admin_user = referringAdmin.id;
        }
      }
    }

    const user = await createUser({
      username,
      fullname,
      phone,
      email,
      password,
      currency_id,
      refer_code: uniqueReferCode,
      isAgreeWithTerms,
      createdBy,
      referred_by,
      referred_by_admin_user,
    });
    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to register user" });
  }
};

export function getClientIp(req: Request): string {
  let ip =
    (req.headers["x-forwarded-for"] as string)
      ?.split(",")
      .map((s) => s.trim())[0] ||
    (req.headers["x-real-ip"] as string) ||
    req.socket?.remoteAddress ||
    (req.connection as any)?.remoteAddress ||
    req.ip ||
    "Unknown";
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
    ip = "127.0.0.1";
  }
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }
  return ip;
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userNameOrEmailorPhone, password } = req.body;
    if (!userNameOrEmailorPhone || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing username/email/phone or password",
      });
    }
    const user = await findUserByUsernameOrEmail(userNameOrEmailorPhone);
    if (!user || typeof user.password !== "string") {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }
    const isMatch = password === user.password;
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }
    // --- Device Info Extraction ---
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser.UAParser(userAgent);
    const uaResult = parser.getResult();
    const device_type = uaResult.device.type || "Desktop";
    const device_name = uaResult.device.model || uaResult.os.name || "Unknown";
    const os_version = uaResult.os.name
      ? `${uaResult.os.name} ${uaResult.os.version || ""}`.trim()
      : "Unknown";
    const browser = uaResult.browser.name || "Unknown";
    const browser_version = uaResult.browser.version || "Unknown";
    const ip_address = getClientIp(req);
    // You can now use device_type, device_name, os_version, browser, browser_version, ip_address as needed (e.g., log, save to DB, etc.)
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    await db
      .update(users)
      .set({
        isLoggedIn: true,
        device_type,
        device_name,
        os_version,
        browser,
        browser_version,
        lastIp: ip_address,
        lastLogin: new Date(),
      })
      .where(eq(users.id, user.id));

    return res.json({
      status: true,
      message: "Login successful",
      data: user,
      accessToken: token,
      device: {
        device_type,
        device_name,
        os_version,
        browser,
        browser_version,
        ip_address,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to login" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }
    const data = req.body;
    const updated = await updateUserModel(Number(id), data);
    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "User not found or not updated" });
    }
    return res.json({
      status: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }
    const result = await deleteUserModel(Number(id));
    if (!result) {
      return res
        .status(404)
        .json({ status: false, message: "User not found or not deleted" });
    }
    return res.json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete user" });
  }
};
