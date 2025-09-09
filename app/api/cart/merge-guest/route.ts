import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { handleApiError } from "@/lib/auth/errors";
import { addSecurityHeaders, checkRateLimit, getClientIP } from "@/lib/auth/security";
import Cart from "@/models/Cart";
import { Types } from "mongoose";
import { getUserId } from "@/lib/services/getUserId";

const mergeGuestCartSchema = z.object({
  guestCartItems: z.array(z.object({
    product: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
    originalPrice: z.number().min(0).optional(),
    unit: z.string(),
    name: z.string(),
    image: z.string(),
  })),
});

// Helper function to handle guest cart merging
async function mergeGuestCartWithUserCart(userId: string, guestCartItems: any[]): Promise<any> {
  if (!guestCartItems || guestCartItems.length === 0) {
    return null;
  }

  let cart = await Cart.findOne({ user: userId, isActive: true });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      deliveryFee: 5.78,
    });
  }

  // Merge guest cart items with existing cart
  for (const guestItem of guestCartItems) {
    const existingItemIndex = (cart as any).items.findIndex(
      (item: any) => item.product.toString() === guestItem.product
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      (cart as any).items[existingItemIndex].quantity += guestItem.quantity;
    } else {
      // Add new item
      (cart as any).items.push({
        product: new Types.ObjectId(guestItem.product),
        quantity: guestItem.quantity,
        price: guestItem.price,
        originalPrice: guestItem.originalPrice,
        unit: guestItem.unit,
        name: guestItem.name,
        image: guestItem.image,
      });
    }
  }

  await cart.save();
  return cart;
}

// POST /api/cart/merge-guest - Merge guest cart with user cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`cart_merge_guest:${clientIP}`, 10, 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        )
      );
    }

    const userId = await getUserId(request);
    if (!userId) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Authentication required",
            code: "UNAUTHORIZED",
          },
          { status: 401 }
        )
      );
    }

    const body = await request.json();
    const parsed = mergeGuestCartSchema.safeParse(body);
    
    if (!parsed.success) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: parsed.error.issues,
            code: "VALIDATION_ERROR",
          },
          { status: 400 }
        )
      );
    }

    const { guestCartItems } = parsed.data;

    // Merge guest cart with user cart
    const mergedCart = await mergeGuestCartWithUserCart(userId, guestCartItems);

    if (!mergedCart) {
      // No guest cart items to merge, return existing user cart
      const existingCart = await Cart.findOne({ user: userId, isActive: true })
        .populate("items.product", "name price originalPrice unit image stock stockLabel isActive")
        .lean();

      return addSecurityHeaders(
        NextResponse.json(
          {
            success: true,
            message: "No guest cart items to merge",
            data: existingCart,
          },
          { status: 200 }
        )
      );
    }

    // Return updated cart with populated product data
    const updatedCart = await Cart.findById(mergedCart._id)
      .populate("items.product", "name price originalPrice unit image stock stockLabel isActive")
      .lean();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Guest cart merged successfully",
          data: updatedCart,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
