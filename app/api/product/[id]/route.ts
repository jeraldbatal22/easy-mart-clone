import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { handleApiError, NotFoundError } from "@/lib/auth/errors";
import { addSecurityHeaders, checkRateLimit, getClientIP } from "@/lib/auth/security";
import Product from "@/models/Product";
import { Types } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`product_detail:${clientIP}`, 120, 60 * 1000)) {
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

    const { id } = await params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Invalid product id",
            code: "INVALID_ID",
          },
          { status: 400 }
        )
      );
    }

    const product = await Product.findOne({ _id: id, isActive: true }).lean();
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          data: product,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}


