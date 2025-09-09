import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { handleApiError } from "@/lib/auth/errors";
import {
  addSecurityHeaders,
  checkRateLimit,
  getClientIP,
} from "@/lib/auth/security";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { Types } from "mongoose";
import { getUserId } from "@/lib/services/getUserId";

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(1000, "Quantity cannot exceed 1000"),
});

const updateCartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int()
    .min(0, "Quantity cannot be negative")
    .max(1000, "Quantity cannot exceed 1000"),
});

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`cart_get:${clientIP}`, 60, 60 * 1000)) {
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

    const cart = await Cart.findOne({ user: userId, isActive: true })
      .populate(
        "items.product",
        "name price originalPrice unit image stock stockLabel isActive"
      )
      .lean();

    if (!cart) {
      // Create empty cart if none exists
      const newCart = await Cart.create({
        user: userId,
        items: [],
        deliveryFee: 5.78,
      });

      return addSecurityHeaders(
        NextResponse.json(
          {
            success: true,
            data: newCart,
          },
          { status: 200 }
        )
      );
    }

    // Filter out items with inactive products
    const activeItems = (cart as any).items.filter(
      (item: any) => item.product && item.product.isActive
    );

    // Update cart if any items were filtered out
    if (activeItems.length !== (cart as any).items.length) {
      await Cart.findByIdAndUpdate((cart as any)._id, { items: activeItems });
      (cart as any).items = activeItems;
    }

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          data: cart,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`cart_add:${clientIP}`, 30, 60 * 1000)) {
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
    const parsed = addToCartSchema.safeParse(body);

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

    const { productId, quantity } = parsed.data;

    // Verify product exists and is active
    const product = await Product.findById(productId).lean();
    if (!product || !(product as any).isActive) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Product not found or inactive",
            code: "PRODUCT_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    // Check stock availability
    if ((product as any).stock < quantity) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: `Only ${(product as any).stock} items available in stock`,
            code: "INSUFFICIENT_STOCK",
          },
          { status: 400 }
        )
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        deliveryFee: 5.78,
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = (cart as any).items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const newQuantity =
        (cart as any).items[existingItemIndex].quantity + quantity;

      if ((product as any).stock < newQuantity) {
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: `Only ${(product as any).stock} items available in stock`,
              code: "INSUFFICIENT_STOCK",
            },
            { status: 400 }
          )
        );
      }

      (cart as any).items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      const cartItem = {
        product: new Types.ObjectId(productId),
        quantity,
        price: (product as any).price,
        originalPrice: (product as any).originalPrice,
        unit: (product as any).unit,
        name: (product as any).name,
        image: (product as any).image,
      };

      (cart as any).items.push(cartItem);
    }

    await cart.save();

    // Return updated cart with populated product data
    const updatedCart = await Cart.findById(cart._id)
      .populate(
        "items.product",
        "name price originalPrice unit image stock stockLabel isActive"
      )
      .lean();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Item added to cart successfully",
          data: updatedCart,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`cart_update:${clientIP}`, 30, 60 * 1000)) {
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
    const parsed = updateCartItemSchema.safeParse(body);

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

    const { productId, quantity } = parsed.data;

    const cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Cart not found",
            code: "CART_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    const itemIndex = (cart as any).items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Item not found in cart",
            code: "ITEM_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    if (quantity === 0) {
      // Remove item from cart
      (cart as any).items.splice(itemIndex, 1);
    } else {
      // Update quantity
      // Check stock availability
      const product = await Product.findById(productId).lean();
      if (!product || !(product as any).isActive) {
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: "Product not found or inactive",
              code: "PRODUCT_NOT_FOUND",
            },
            { status: 404 }
          )
        );
      }

      if ((product as any).stock < quantity) {
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: `Only ${(product as any).stock} items available in stock`,
              code: "INSUFFICIENT_STOCK",
            },
            { status: 400 }
          )
        );
      }

      (cart as any).items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Return updated cart with populated product data
    const updatedCart = await Cart.findById(cart._id)
      .populate(
        "items.product",
        "name price originalPrice unit image stock stockLabel isActive"
      )
      .lean();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Cart updated successfully",
          data: updatedCart,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`cart_delete:${clientIP}`, 30, 60 * 1000)) {
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

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const clearAll = searchParams.get("clearAll") === "true";

    const cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Cart not found",
            code: "CART_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    if (clearAll) {
      // Clear entire cart
      (cart as any).items = [];
      await cart.save();

      return addSecurityHeaders(
        NextResponse.json(
          {
            success: true,
            message: "Cart cleared successfully",
            data: cart,
          },
          { status: 200 }
        )
      );
    }

    if (!productId) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Product ID is required",
            code: "PRODUCT_ID_REQUIRED",
          },
          { status: 400 }
        )
      );
    }

    // Remove specific item
    const itemIndex = (cart as any).items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Item not found in cart",
            code: "ITEM_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    (cart as any).items.splice(itemIndex, 1);
    await cart.save();

    // Return updated cart with populated product data
    const updatedCart = await Cart.findById(cart._id)
      .populate(
        "items.product",
        "name price originalPrice unit image stock stockLabel isActive"
      )
      .lean();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Item removed from cart successfully",
          data: updatedCart,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
