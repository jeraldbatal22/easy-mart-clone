<div align="center">

![Easy Mart Logo](public/assets/icons/logo-with-text.svg)

# Easy Mart Clone

A production-style grocery e-commerce experience inspired by an open-source Figma kit and rebuilt with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Next API Routes**. The goal is to demonstrate how to translate a polished design system into a full-stack shopping experience with authentication, onboarding, admin tooling, and real-time cart flows.

</div>

---

## ✨ Highlights

- **Design parity** with the Easy Mart Figma exploration (marketing, storefront, onboarding, admin)
- **Full-stack Next.js 15 App Router** with server actions, API routes, middleware, and streaming UIs
- **Type-safe data layer** via Mongoose models, Zod validation, Redux Toolkit slices, and SWR data fetching
- **OTP-based auth flows** (sign up, sign in, resend, verify, and protected layouts)
- **Headless CMS-style admin** for categories, sub-categories, and product management
- **Cart persistence** with guest merging, server-side reconciliation, and client hydration
- **Email + Cloudinary integrations** for transactional flows and asset management

---

## 🧱 Tech Stack

| Layer        | Technologies                                                                 |
|--------------|-------------------------------------------------------------------------------|
| UI / Styling | Next.js App Router, TypeScript, Tailwind CSS v4, Radix UI, Lucide Icons       |
| State        | Redux Toolkit, React Hook Form, SWR, custom hooks                             |
| Backend      | Next API Routes, Middleware, Mongoose Models, JWT auth, Nodemailer, Cloudinary|
| Tooling      | pnpm, ESLint 9, TypeScript 5, PostCSS, Turbopack (dev)                        |

---

## 📁 Project Structure

```
app/                      # App Router entry points (public, protected, API routes)
components/               # Reusable UI, admin utilities, and layout primitives
lib/                      # API clients, providers, hooks, services, store, utils
models/                   # Mongoose schemas (User, Product, Category, Cart, OTP)
public/                   # Static assets (logos, promo banners, product imagery)
ENVIRONMENT_SETUP.md      # Required runtime secrets (.env.local template)
EMAIL_SETUP.md            # SMTP testing instructions
```

Each major surface (public storefront, onboarding, checkout, account, admin) has its own nested layouts inside `app/`, while API routes live under `app/api/*` to colocate transport and view logic.

---

## 🚀 Getting Started

1. **Prerequisites**
   - Node.js ≥ 20 (aligned with Next.js 15 requirements)
   - pnpm ≥ 9 (recommended; Yarn/NPM work too)

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   - Copy the template from `ENVIRONMENT_SETUP.md` into a new `.env.local`
   - Provide MongoDB, JWT, Cloudinary, and SMTP credentials
   - Optional: configure `REDIS_URL` for production rate limiting

4. **Run the dev server**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:3000`. Turbopack is enabled for faster HMR.

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 🔌 API Surface

All backend endpoints live in `app/api`. Highlights include:

- `auth/` → register, sign in, OTP validation, resend, and session verification
- `cart/` → cart CRUD plus guest merge operations
- `product/` & `category/` → catalog queries, best sellers, subcategory filtering
- `upload/` → Cloudinary-backed asset uploads for the admin CMS

Each route is typed end-to-end (Zod + TypeScript) and re-used on the client through `lib/api/*` helpers and SWR hooks.

---

## 🧩 Feature Guide

- **Onboarding Flow** (`app/(public)/onboarding`)  
  Multi-step nutrition goals, preferences, and timeline configuration to personalize recommendations.

- **Storefront & Product Discovery** (`app/(public)/products`)  
  Category navigation, promotional banners, subcategory filters, enhanced product cards, and detail pages.

- **Cart & Checkout** (`components/common/product/*`, `app/(protected)/checkout`)  
  Add-to-cart hooks, guest cart persistence, server merge, and checkout review screens.

- **Account Surfaces** (`app/(protected)/account/*`)  
  Order history, saved carts, settings, and profile recovery flows protected via middleware.

- **Admin CMS** (`app/(protected)/admin/*`)  
  CRUD UIs for categories, sub-categories, and products, plus analytics-ready layouts.

- **Email + OTP Auth** (`lib/services/emailService.ts`, `app/api/auth/*`)  
  Nodemailer pipeline for OTP, verification, and transactional notifications. Config details live in `EMAIL_SETUP.md`.

---

## 🧪 Testing & Quality

- ESLint 9 + Next.js config (`pnpm lint`)
- Targeted hook tests under `lib/hooks/__tests__`
- Error boundaries and loading states for all layouts (`components/common`)

Future work: add Playwright smoke tests and contract tests for critical API routes.

---

## 📐 Design Reference

This build mirrors the public Easy Mart Figma exploration. Import the Figma file, inspect typography/colors, and update Tailwind tokens or component variants as needed to keep parity. Contributions improving the fidelity between design and implementation are welcome.

---

Happy shipping! 🛒

**Important features**

Email-Based Sign-In/Sign-Up with OTP
Users sign in or sign up using their email and receive a one-time password (OTP) for authentication, ensuring a secure, password-free login process.

- Email OTP Notifications
I set up an email system to send OTPs using SMTP, ensuring a smooth and secure sign-in experience.

- Cloudinary Image Uploads
I integrated Cloudinary to manage and optimize product images, improving load times and visual quality across devices.

- State Management with Redux
Used Redux to handle global state, ensuring consistent data across the app (like user sessions and cart updates).

- Data Fetching with SWR
Implemented SWR for efficient data fetching and caching, improving app performance and user experience.

- Server-Side Rendering (SSR)
Used SSR with Next.js to improve SEO and speed by pre-rendering important pages on the server.

- Role-Based Access Control
Set up different permissions for admins and shop owners, allowing them to manage the platform and their own stores separately.

Current Status: The project is approximately 70-80% complete, with most UI and core functionalities finished. Ongoing work includes refining features and completing additional functionality.