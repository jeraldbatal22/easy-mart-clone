import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_changeme";

export interface TokenPayload {
  id: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "merchant" | "guest";
  firstName?: string;
  lastName?: string; 
  fullName?: string;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5m" });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwt.decode(token);
    const expMs = decoded && decoded.exp ? decoded.exp * 1000 : null;
    if (!expMs) {
      return false;
    }
    return Date.now() >= expMs;
  } catch {
    return false;
  }
}