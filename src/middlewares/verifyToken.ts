import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyJwt(token);
    (req as any).user = decoded;
    return next();
  } catch {
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token" });
  }
}
