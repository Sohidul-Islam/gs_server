import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findAdminByUsernameOrEmail,
  createAdmin,
  getAdminById,
  getAdminsWithFilters,
  updateAdmin,
  deleteAdmin as deleteAdminModel,
  AdminRole,
} from "../models/admin.model";
import { db } from "../db/connection";
import { adminUsers } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyJwt } from "../utils/jwt";
import { getUsersWithFilters } from "../models/user.model";
import * as UAParser from "ua-parser-js";
import { DecodedUser } from "../middlewares/verifyToken";

export function getClientIp(req: Request): string {
  const ipSource = {
    xForwardFor: (req.headers["x-forwarded-for"] as string)
      ?.split(",")
      .map((s) => s.trim())[0],
    xRealIp: req.headers["x-real-ip"] as string,
    remoteAddress: req.socket?.remoteAddress,
    remoteAddressConnection: (req.connection as any)?.remoteAddress,
    ip: req.ip,
  };
  console.log({
    ipSource,
    reqAgent: req.headers["user-agent"],
  });
  let ip =
    ipSource.xForwardFor ||
    ipSource.xRealIp ||
    ipSource.remoteAddress ||
    ipSource.remoteAddressConnection ||
    ipSource.ip ||
    "Unknown";

  // Normalize IPv6 localhost
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
    ip = "127.0.0.1";
  }
  // Remove IPv6 prefix if present (e.g., "::ffff:192.168.1.1")
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }
  return ip;
}

export const adminRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      fullname,
      phone,
      email,
      password,
      role,
      country,
      city,
      street,
      minTrx,
      maxTrx,
      currency,
      createdBy,
      status,
      refCode,
    } = req.body;

    const userData = (req as unknown as { user: DecodedUser | null })?.user;
    if (!username || !fullname || !phone || !email || !password || !role) {
      res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
      return;
    }

    if (
      userData?.role === "superAgent" &&
      ["admin", "superAgent", "superAffiliate", "affiliate"].includes(role)
    ) {
      res
        .status(400)
        .json({ status: false, message: `Super agent can't create ${role}` });
      return;
    }

    if (
      userData?.role === "agent" &&
      ["admin", "superAgent", "agent", "superAffiliate", "affiliate"].includes(
        role
      )
    ) {
      res
        .status(400)
        .json({ status: false, message: `Agent can't create ${role}` });
      return;
    }

    if (
      userData?.role === "superAffiliate" &&
      ["admin", "superAgent", "agent", "superAffiliate"].includes(role)
    ) {
      res.status(400).json({
        status: false,
        message: `Super Affiliate can't create ${role}`,
      });
      return;
    }

    if (
      userData?.role === "affiliate" &&
      ["admin", "superAgent", "agent", "superAffiliate", "affiliate"].includes(
        role
      )
    ) {
      res.status(400).json({
        status: false,
        message: `Affiliate can't create ${role}`,
      });
      return;
    }

    const existing =
      (await findAdminByUsernameOrEmail(username)) ||
      (await findAdminByUsernameOrEmail(email));
    if (existing) {
      res
        .status(409)
        .json({ status: false, message: "Admin user already exists" });
      return;
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await createAdmin({
      username,
      fullname,
      phone,
      email,
      password: password,
      role,
      country,
      city,
      street,
      minTrx: minTrx !== undefined ? String(minTrx) : undefined,
      maxTrx: maxTrx !== undefined ? String(maxTrx) : undefined,
      currency,
      createdBy,
      refCode,
      status,
    });
    res.status(201).json({
      status: true,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to register admin" });
  }
};

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userNameOrEmailorPhone, password } = req.body;
    if (!userNameOrEmailorPhone || !password) {
      res.status(400).json({
        status: false,
        message: "Missing username/email/phone or password",
      });
      return;
    }
    const admin = await findAdminByUsernameOrEmail(userNameOrEmailorPhone);
    if (!admin || typeof admin.password !== "string") {
      res.status(401).json({ status: false, message: "Invalid credentials" });
      return;
    }
    const isMatch = password === admin.password;
    if (!isMatch) {
      res.status(401).json({ status: false, message: "Invalid credentials" });
      return;
    }

    // --- Device Info Extraction ---
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser.UAParser(userAgent);
    const uaResult = parser.getResult();
    console.log({ uaResult });
    const device_type = uaResult.device.type || "Desktop";
    const device_name = uaResult.device.model || uaResult.os.name || "Unknown";
    const os_version = uaResult.os.name
      ? `${uaResult.os.name} ${uaResult.os.version || ""}`.trim()
      : "Unknown";
    const browser = uaResult.browser.name || "Unknown";
    const browser_version = uaResult.browser.version || "Unknown";
    // Get IP address
    const ip_address = getClientIp(req);

    if (admin.status !== "active") {
      res.status(401).json({ status: false, message: "User is inactive" });
      return;
    }

    if (admin.id)
      await db
        .update(adminUsers)
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
    res.json({
      status: true,
      message: "Login successful",
      data: admin,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to login", error });
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

export const adminLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("No token provided");
    (err as any).status = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];

  const decoded = verifyJwt(token);

  const user = decoded;

  if (!user || !user.id) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }
  await db
    .update(adminUsers)
    .set({ isLoggedIn: false })
    .where(eq(adminUsers.id, user.id));
  res.json({ status: true, message: "Logout successful" });
};

export const adminProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("No token provided");
    (err as any).status = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];

  const decoded = verifyJwt(token);

  const user = decoded;

  if (!user || !user.id) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }
  try {
    const admin = await getAdminById(user.id);
    console.log({ admin });

    if (admin?.id) {
      if (admin.status === "active") {
        res.status(200).json({
          status: true,
          message: "Profile fetched successfully",
          data: admin,
        });
      } else {
        res.status(401).json({
          status: false,
          message: "User is inactive",
          data: null,
        });
      }
    } else {
      res.status(200).json({
        status: false,
        message: "Profile not found",
        data: admin,
      });
      return;
    }
  } catch (error) {
    if (!res.headersSent) {
      res
        .status(200)
        .json({ message: "Something went wrong", status: false, error });
    }
  }
};

export const getPlayers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    playerId,
    phone,
    status,
    keyword,
    page = 1,
    pageSize = 10,
  } = req.query;

  const userData = (req as unknown as { user: DecodedUser }).user;

  const filters = {
    playerId: playerId ? Number(playerId) : undefined,
    phone: phone as string | undefined,
    status: status as string | undefined,
    keyword: keyword as string | undefined,
    createdBy: userData.role !== "admin" ? userData.id : undefined,
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
  };
  const result = await getUsersWithFilters(filters);
  res.json({ status: true, data: result });
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const { role, page = 1, pageSize = 10, keyword } = req.query;
    const filters = {
      role: role as AdminRole | undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      searchKeyword: keyword as string | undefined,
      roleList: ["admin"] as AdminRole[],
    };
    const result = await getAdminsWithFilters(filters);
    res.json({ status: true, ...result });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch admins", error });
  }
};

export const getAgents = async (req: Request, res: Response) => {
  try {
    let { role, page = 1, pageSize = 10, keyword, status } = req.query;
    let roles: ("superAgent" | "agent")[] = ["superAgent", "agent"];
    let roleFilter:
      | ("superAgent" | "agent")
      | ("superAgent" | "agent")[]
      | undefined = ["superAgent", "agent"];

    if (role) {
      roleFilter = role as "superAgent" | "agent";
    }

    // Validate and sanitize status
    const validStatuses = ["active", "inactive"];

    // Ensure status is valid
    let statusFilter: "active" | "inactive" | undefined = undefined;
    if (status && validStatuses.includes(status as any)) {
      statusFilter = status as "active" | "inactive";
    }

    const filters = {
      role: roleFilter,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      searchKeyword: keyword as string | undefined,
      roleList: ["superAgent", "agent"] as AdminRole[],
      status: statusFilter,
    };

    const result = await getAdminsWithFilters(filters);
    // If no role is specified, filter the result to only include superAgent and agent
    if (!roleFilter && result?.data) {
      result.data = result.data.filter((admin: any) =>
        roles.includes(admin.role)
      );
    }
    res.json({ status: true, ...result });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch agents", error });
  }
};

export const getAffiliates = async (req: Request, res: Response) => {
  try {
    let { role, page = 1, pageSize = 10, keyword, status } = req.query;
    let roles: ("superAffiliate" | "affiliate")[] = [
      "superAffiliate",
      "affiliate",
    ];
    let roleFilter:
      | ("superAffiliate" | "affiliate")
      | ("superAffiliate" | "affiliate")[]
      | undefined = ["superAffiliate", "affiliate"];

    if (role) {
      roleFilter = role as "superAffiliate" | "affiliate";
    }

    // Validate and sanitize status
    const validStatuses = ["active", "inactive"];

    // Ensure status is valid
    let statusFilter: "active" | "inactive" | undefined = undefined;
    if (status && validStatuses.includes(status as any)) {
      statusFilter = status as "active" | "inactive";
    }

    const filters = {
      role: roleFilter,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      searchKeyword: keyword as string | undefined,
      roleList: ["superAffiliate", "affiliate"] as AdminRole[],
      status: statusFilter,
    };

    const result = await getAdminsWithFilters(filters);
    // If no role is specified, filter the result to only include superAffiliate and affiliate
    if (!roleFilter && result?.data) {
      result.data = result.data.filter((admin: any) =>
        roles.includes(admin.role)
      );
    }
    res.json({ status: true, ...result });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch affiliates", error });
  }
};

export const updateAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: false, message: "Missing admin id" });
      return;
    }
    const updateData = { ...req.body };
    // If password is present, hash it
    // if (updateData.password) {
    //   updateData.password = await bcrypt.hash(updateData.password, 10);
    // }
    const updatedAdmin = await updateAdmin(Number(id), updateData);
    if (!updatedAdmin) {
      res.status(404).json({ status: false, message: "Admin not found" });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to update admin", error });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: false, message: "Missing admin id" });
      return;
    }
    const result = await deleteAdminModel(Number(id));
    if (!result) {
      res
        .status(404)
        .json({ status: false, message: "Admin not found or not deleted" });
      return;
    }
    res
      .status(200)
      .json({ status: true, message: "Admin deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to delete admin", error });
  }
};
