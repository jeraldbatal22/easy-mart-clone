import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { handleApiError } from "@/lib/auth/errors";
import {
  addSecurityHeaders,
  checkRateLimit,
  getClientIP,
} from "@/lib/auth/security";
import { z } from "zod";
import { GroceryCategory, SubGroceryCategory } from "@/models/Category";

// Schema for subcategory creation
const subGrocerySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  groceryCategoryId: z.string().min(1, "Grocery Category ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`subgrocery_add:${clientIP}`, 5, 1 * 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        )
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const name = formData.get("name");
    const groceryCategoryId = formData.get("groceryCategoryId");

    // Validate form data
    const validationResult = subGrocerySchema.safeParse({ name, groceryCategoryId });
    if (!validationResult.success) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: validationResult.error.issues,
            code: "VALIDATION_ERROR"
          },
          { status: 400 }
        )
      );
    }

    // Check if groceryCategoryId exists
    const groceryCategory = await GroceryCategory.findById(groceryCategoryId);
    if (!groceryCategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Referenced grocery category not found",
            code: "GROCERY_CATEGORY_NOT_FOUND"
          },
          { status: 404 }
        )
      );
    }

    if (!(file instanceof Blob)) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "No file uploaded",
            code: "NO_FILE_UPLOADED"
          },
          { status: 400 }
        )
      );
    }

    // Prepare upload
    const uploadFormData = new FormData();
    uploadFormData.set("type", "subgrocery_categories");
    uploadFormData.set("file", file as any);

    const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorPayload = await uploadResponse.json().catch(() => ({}));
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Failed to upload image",
            details: errorPayload?.error || errorPayload?.message || "Upload failed",
            code: "UPLOAD_FAILED"
          },
          { status: 400 }
        )
      );
    }

    const uploadResult: { url: string } = await uploadResponse.json();

    // Check if subcategory already exists under this grocery category
    const existingSubCategory = await SubGroceryCategory.findOne({
      name: validationResult.data.name,
      groceryCategory: groceryCategoryId,
    });
    if (existingSubCategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory with this name already exists in this grocery category",
            code: "SUBCATEGORY_EXISTS"
          },
          { status: 409 }
        )
      );
    }

    // Save subgrocery category to DB
    const subGroceryCategory = new SubGroceryCategory({
      name,
      groceryCategory: groceryCategoryId,
      imageUrl: uploadResult.url,
    });

    await subGroceryCategory.save();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Sub grocery category created successfully",
          data: {
            id: subGroceryCategory._id,
            name: subGroceryCategory.name,
            groceryCategory: subGroceryCategory.groceryCategory,
            imageUrl: subGroceryCategory.imageUrl,
            createdAt: subGroceryCategory.createdAt,
            updatedAt: subGroceryCategory.updatedAt,
          },
        },
        { status: 201 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting for GET requests
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`subgrocery_get:${clientIP}`, 30, 1 * 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED"
          },
          { status: 429 }
        )
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const groceryCategoryId = searchParams.get("groceryCategoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const query: any = {};
    if (groceryCategoryId) {
      query.groceryCategory = groceryCategoryId;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get subcategories with pagination
    const subcategories = await SubGroceryCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await SubGroceryCategory.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return addSecurityHeaders(
      NextResponse.json({
        success: true,
        data: {
          subcategories,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      })
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
