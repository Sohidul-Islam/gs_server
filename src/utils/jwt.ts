import jwt from "jsonwebtoken";

export function verifyJwt(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
}

export interface JwtPayload {
  id: number;
  email: string;
  username: string;
  role?: string;
}

export type Unit =
| "Years"
| "Year"
| "Yrs"
| "Yr"
| "Y"
| "Weeks"
| "Week"
| "W"
| "Days"
| "Day"
| "D"
| "Hours"
| "Hour"
| "Hrs"
| "Hr"
| "H"
| "Minutes"
| "Minute"
| "Mins"
| "Min"
| "M"
| "Seconds"
| "Second"
| "Secs"
| "Sec"
| "s"
| "Milliseconds"
| "Millisecond"
| "Msecs"
| "Msec"
| "Ms";

export type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type StringValue =
    | `${number}`
    | `${number}${UnitAnyCase}`
    | `${number} ${UnitAnyCase}`;

export function generateJwtToken(payload: JwtPayload, expiresIn: (StringValue|number) = "1h"): string {
  return jwt.sign(
    { ...payload, expiresIn },
    process.env.JWT_SECRET || "your_jwt_secret",
    {
      expiresIn: expiresIn,
    }
  );
}
