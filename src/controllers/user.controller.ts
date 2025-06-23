import { Request, Response } from "express";
import {
  getUsers,
  createUser,
  findUserByUsernameOrEmail,
} from "../models/user.model";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
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
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existing =
      (await findUserByUsernameOrEmail(username)) ||
      (await findUserByUsernameOrEmail(email));
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
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
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ error: "Missing username/email or password" });
    }
    const user = await findUserByUsernameOrEmail(usernameOrEmail);
    if (!user || typeof user.password !== "string") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.json({ message: "Login successful", user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login" });
  }
};
