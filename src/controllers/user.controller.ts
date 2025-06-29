import { Request, Response } from "express";
import {
  getUsers,
  createUser,
  findUserByUsernameOrEmail,
} from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
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
    const user = await createUser({
      username,
      fullname,
      phone,
      email,
      password,
      currency_id,
      refer_code,
      isAgreeWithTerms,
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
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    return res.json({
      status: true,
      message: "Login successful",
      data: user,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to login" });
  }
};
