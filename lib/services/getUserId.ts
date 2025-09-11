import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { isTokenExpired } from "@/lib/auth";

// Helper function to get user ID from request (you'll need to implement this based on your auth system)
export async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      if (isTokenExpired(token)) {
        return null;
      }
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret"
      );
      // Assuming the user id is stored as "id" or "_id" in the payload
      return decoded.id || decoded._id || null;
    } catch {
      // Invalid token
      return null;
    }
  }
  return null;
}