import jwt from "jsonwebtoken";

export function verifyJwt(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
}
