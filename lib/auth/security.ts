import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../auth";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 1 * 60 * 1000 // 1 minute default
): boolean {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitInfo(identifier: string): { count: number; resetTime: number; remaining: number } | null {
  const key = `rate_limit:${identifier}`;
  const record = rateLimitStore.get(key);
  
  if (!record) {
    return null;
  }
  
  const now = Date.now();
  if (now > record.resetTime) {
    rateLimitStore.delete(key);
    return null;
  }
  
  return {
    count: record.count,
    resetTime: record.resetTime,
    remaining: Math.max(0, record.resetTime - now)
  };
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  return response;
}

export async function validateAuthToken(request: NextRequest): Promise<{ id: string; email: string } | null> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}
