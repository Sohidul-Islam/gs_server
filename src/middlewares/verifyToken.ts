import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { AdminRole } from "../models/admin.model";

export type DecodedUser = {
  id: number;
  email: string;
  username: string;
  role: AdminRole;
};

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("No token provided");
    (err as any).status = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyJwt(token);
    (req as any).user = decoded as DecodedUser;
    return next();
  } catch {
    const err = new Error("Invalid or expired token");
    (err as any).status = 401;
    throw err;
  }
}
