import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { isTokenExpired } from "@/lib/auth";

// Define route groups
// const publicRoutes = [
//   "/signin",
//   "/signup",
//   "/",
//   "/products/:id",
//   "/cart",
//   "/search",
//   "/category",
// ];

const protectedRoutes = ["/checkout", "/account/orders", "account/orders/:id", "/account/details", "/account/my-cart" ];

const adminRoutes = [
  "/cms",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 2️⃣ Read token from cookies
  const token = req.cookies.get("access_token")?.value;

  // 1️⃣ Redirect to / if navigate to signup/signin when user is authenticated
  if (token && ["/signin", "/signup"].some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3️⃣ Protected/Admin routes → require token
  if (!token) {
    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) ||
      adminRoutes.some((route) => pathname.startsWith(route))
    ) {
      const signinUrl = new URL("/signin", req.url);
      signinUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signinUrl);
    }
    return NextResponse.next();
  }

  try {
    // 4️⃣ Expired token → clear cookie and redirect to signin
    if (isTokenExpired(token)) {
      const signinUrl = new URL("/signin", req.url);
      signinUrl.searchParams.set("from", pathname);
      signinUrl.searchParams.set("reason", "token_expired");
      const res = NextResponse.redirect(signinUrl);
      res.cookies.set("access_token", "", { path: "/", httpOnly: true, maxAge: 0 });
      return res;
    }

    // 5️⃣ Decode for role checks
    const decodedToken: any = jwt.decode(token);
    const role = decodedToken?.role as string | undefined; // e.g., "user" | "admin"

    // 6️⃣ Admin-only routes
    // if (adminRoutes.some((route) => pathname.startsWith(route))) {
    //   if (role !== "admin") {
    //     return NextResponse.redirect(new URL("/unauthorized", req.url));
    //   }
    // }
  } catch (err) {
    console.error("JWT verification failed:", err);
    const signinUrl = new URL("/signin", req.url);
    signinUrl.searchParams.set("from", pathname);
    signinUrl.searchParams.set("reason", "invalid_token");
    return NextResponse.redirect(signinUrl);
  }

  // ✅ Otherwise allow access
  return NextResponse.next();
}

// Apply middleware to relevant routes only
export const config = {
  matcher: [
    // Public
    "/signin",
    "/signup",
    "/products/:path*",
    "/my-cart",
    "/search/:path*",
    "/category/:path*",

    // Protected
    "/onboarding",
    "/checkout/:path*",
    "/account/:path*",

    // Admin
    "/cms/:path*",
  ],
};
