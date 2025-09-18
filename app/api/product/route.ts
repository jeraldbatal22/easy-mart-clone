import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { handleApiError } from "@/lib/auth/errors";
import { addSecurityHeaders, checkRateLimit, getClientIP } from "@/lib/auth/security";
import Product from "@/models/Product";
import { GroceryCategory } from "@/models/Category";
import { Types } from "mongoose";

// Validation schema for creating a product via multipart/form-data
const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).trim(),
  description: z.string().optional(),
  price: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0)),
  originalPrice: z
    .preprocess((v) => (v === null || v === undefined || v === "" ? undefined : typeof v === "string" ? Number(v) : v),
      z.number().min(0).optional()
    ),
  unit: z.string().min(1, "Unit is required").trim(),
  stock: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().int().min(0)),
  stockLabel: z.string().optional(),
  groceryCategory: z.string().min(1, "Grocery Category is required").trim(),
  subGroceryCategory: z.string().min(1, "Sub Grocery Category is required").trim(),
  isBestSeller: z.preprocess((v) => (v === "true" || v === true), z.boolean().optional()).default(false),
  isTrending: z.preprocess((v) => (v === "true" || v === true), z.boolean().optional()).default(false),
  isVerified: z.preprocess((v) => (v === "true" || v === true), z.boolean().optional()).default(false),
  featured: z.preprocess((v) => (v === "true" || v === true), z.boolean().optional()).default(false),
  discount: z
    .preprocess((v) => {
      if (typeof v === "string" && v) {
        try { return JSON.parse(v); } catch { return v; }
      }
      return v;
    }, z.object({
      percentage: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).max(100).optional()),
      type: z.enum(["percentage", "fixed"]).optional(),
      value: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional())
    }).partial().optional()),
  tags: z.preprocess((v) => {
    if (typeof v === "string" && v) {
      try { const parsed = JSON.parse(v); if (Array.isArray(parsed)) return parsed; } catch {}
      return v.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return v;
  }, z.array(z.string()).optional()),
  weight: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
  dimensions: z
    .preprocess((v) => {
      if (typeof v === "string" && v) {
        try { return JSON.parse(v); } catch { return v; }
      }
      return v;
    }, z.object({
      length: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
      width: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
      height: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
    }).partial().optional()),
  nutritionalInfo: z
    .preprocess((v) => {
      if (typeof v === "string" && v) {
        try { return JSON.parse(v); } catch { return v; }
      }
      return v;
    }, z.object({
      calories: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
      protein: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
      carbs: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
      fat: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
      fiber: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().min(0).optional()),
    }).partial().optional()),
  imageUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`product_create:${clientIP}`, 10, 1 * 60 * 1000)) {
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

    const formData = await request.formData();
    const file = formData.get("file");

    // Collect fields from formData
    const raw: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "file") continue;
      raw[key] = value as any;
    }

    const parsed = createProductSchema.safeParse(raw);
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

    // Handle image: either provided via file or imageUrl
    let imageUrl = parsed.data.imageUrl;
    if (!imageUrl) {
      if (!(file instanceof Blob)) {
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: "Product image is required",
              code: "IMAGE_REQUIRED",
            },
            { status: 400 }
          )
        );
      }

      // Forward upload to internal upload API
      const uploadForm = new FormData();
      uploadForm.set("file", file);
      uploadForm.set("type", "product");

      const uploadRes = await fetch(`${request.nextUrl.origin}/api/upload`, {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        const errPayload = await uploadRes.json().catch(() => ({}));
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: "Failed to upload image",
              details: errPayload?.error || errPayload?.message || "UPLOAD_FAILED",
              code: "UPLOAD_FAILED",
            },
            { status: 400 }
          )
        );
      }

      const uploaded: any = await uploadRes.json();
      imageUrl = uploaded.url;
    }

    // Auto-generate stockLabel if not provided
    let stockLabel = parsed.data.stockLabel;
    if (!stockLabel) {
      if (parsed.data.stock === 0) stockLabel = "Out of Stock";
      else if (parsed.data.stock <= 10) stockLabel = `${parsed.data.stock} Left`;
      else stockLabel = "In Stock";
    }

    const product = await Product.create({
      name: parsed.data.name,
      description: parsed.data.description,
      image: imageUrl,
      price: parsed.data.price,
      originalPrice: parsed.data.originalPrice,
      unit: parsed.data.unit,
      stock: parsed.data.stock,
      stockLabel,
      groceryCategory: parsed.data.groceryCategory,
      subGroceryCategory: parsed.data.subGroceryCategory,
      isBestSeller: parsed.data.isBestSeller,
      isTrending: parsed.data.isTrending,
      isVerified: parsed.data.isVerified,
      discount: parsed.data.discount,
      tags: parsed.data.tags,
      weight: parsed.data.weight,
      dimensions: parsed.data.dimensions,
      nutritionalInfo: parsed.data.nutritionalInfo,
      isActive: true,
      featured: parsed.data.featured,
    });

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Product created successfully",
          data: product,
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

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`product_list:${clientIP}`, 120, 60 * 1000)) {
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

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const groceryCategory = searchParams.get("groceryCategory");
    const groceryCategoryIdParam = searchParams.get("groceryCategoryId");
    const query = searchParams.get("q");

    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.min(100, Math.max(1, Number(limitParam) || 12));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { isActive: true };

    // Resolve groceryCategory filter: allow ID via `groceryCategoryId`,
    // or a category name/ID via `groceryCategory`.
    let resolvedGroceryCategoryId: string | null = null;
    if (groceryCategoryIdParam && Types.ObjectId.isValid(groceryCategoryIdParam)) {
      resolvedGroceryCategoryId = groceryCategoryIdParam;
    } else if (groceryCategory) {
      if (Types.ObjectId.isValid(groceryCategory)) {
        resolvedGroceryCategoryId = groceryCategory;
      } else {
        const categoryDoc = await GroceryCategory.findOne({ name: groceryCategory }).select("_id").lean();
        if (categoryDoc && typeof categoryDoc === "object" && "_id" in categoryDoc && categoryDoc._id) {
          resolvedGroceryCategoryId = String(categoryDoc._id);
        } else {
          // If category name provided but not found, return empty result set early
          return addSecurityHeaders(
            NextResponse.json(
              {
                success: true,
                data: [],
                pagination: {
                  page,
                  limit,
                  total: 0,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPrevPage: page > 1,
                },
              },
              { status: 200 }
            )
          );
        }
      }
    }

    if (resolvedGroceryCategoryId) {
      filter.groceryCategory = resolvedGroceryCategoryId;
    }
    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const response = NextResponse.json(
      {
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );

    // Add cache headers for stale-while-revalidate
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    response.headers.set('ETag', `"products-${page}-${limit}-${groceryCategory || 'all'}"`);

    return addSecurityHeaders(response);
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`product_update:${clientIP}`, 10, 1 * 60 * 1000)) {
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

    const formData = await request.formData();
    const id = formData.get("id");
    const file = formData.get("file");

    if (!id) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Product ID is required",
            code: "MISSING_ID",
          },
          { status: 400 }
        )
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Product not found",
            code: "PRODUCT_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    // Collect fields from formData
    const raw: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "file" || key === "id") continue;
      raw[key] = value as any;
    }

    const parsed = createProductSchema.safeParse(raw);
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

    // Handle image: either provided via file or imageUrl
    let imageUrl = parsed.data.imageUrl || existingProduct.image;
    if (file instanceof Blob) {
      // Forward upload to internal upload API
      const uploadForm = new FormData();
      uploadForm.set("file", file);
      uploadForm.set("type", "product");

      const uploadRes = await fetch(`${request.nextUrl.origin}/api/upload`, {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        const errPayload = await uploadRes.json().catch(() => ({}));
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: "Failed to upload image",
              details: errPayload?.error || errPayload?.message || "UPLOAD_FAILED",
              code: "UPLOAD_FAILED",
            },
            { status: 400 }
          )
        );
      }

      const uploaded: any = await uploadRes.json();
      imageUrl = uploaded.url;
    }

    // Auto-generate stockLabel if not provided
    let stockLabel = parsed.data.stockLabel;
    if (!stockLabel) {
      if (parsed.data.stock === 0) stockLabel = "Out of Stock";
      else if (parsed.data.stock <= 10) stockLabel = `${parsed.data.stock} Left`;
      else stockLabel = "In Stock";
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: parsed.data.name,
        description: parsed.data.description,
        image: imageUrl,
        price: parsed.data.price,
        originalPrice: parsed.data.originalPrice,
        unit: parsed.data.unit,
        stock: parsed.data.stock,
        stockLabel,
        groceryCategory: parsed.data.groceryCategory,
        subGroceryCategory: parsed.data.subGroceryCategory,
        isBestSeller: parsed.data.isBestSeller,
        isTrending: parsed.data.isTrending,
        isVerified: parsed.data.isVerified,
        discount: parsed.data.discount,
        tags: parsed.data.tags,
        weight: parsed.data.weight,
        dimensions: parsed.data.dimensions,
        nutritionalInfo: parsed.data.nutritionalInfo,
        featured: parsed.data.featured,
      },
      { new: true }
    );

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Product updated successfully",
          data: updatedProduct,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`product_delete:${clientIP}`, 5, 1 * 60 * 1000)) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Product ID is required",
            code: "MISSING_ID",
          },
          { status: 400 }
        )
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Product not found",
            code: "PRODUCT_NOT_FOUND",
          },
          { status: 404 }
        )
      );
    }

    // Soft delete by setting isActive to false
    await Product.findByIdAndUpdate(id, { isActive: false });

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Product deleted successfully",
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}