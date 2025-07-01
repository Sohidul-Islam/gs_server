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
} from "../models/admin.model";
import { db } from "../db/connection";
import { adminUsers } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyJwt } from "../utils/jwt";
import { getUsersWithFilters } from "../models/user.model";

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
    } = req.body;
    if (!username || !fullname || !phone || !email || !password || !role) {
      res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
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
    // console.log({ admin });

    if (admin?.id)
      res.status(200).json({
        status: true,
        message: "Profile fetched successfully",
        data: admin,
      });
    else {
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
  const filters = {
    playerId: playerId ? Number(playerId) : undefined,
    phone: phone as string | undefined,
    status: status as string | undefined,
    keyword: keyword as string | undefined,
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
      role: role as
        | ("admin" | "superAgent" | "agent" | "superAffiliate" | "affiliate")
        | undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      searchKeyword: keyword as string | undefined,
    };
    const result = await getAdminsWithFilters(filters);
    res.json({ status: true, ...result });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch admins", error });
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
