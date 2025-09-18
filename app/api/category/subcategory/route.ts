import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SubGroceryCategory } from "@/models/Category";
import { handleApiError } from "@/lib/auth/errors";
import { addSecurityHeaders, getClientIP, checkRateLimit } from "@/lib/auth/security";
import { z } from "zod";

const subcategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  groceryCategory: z.string().min(1, "Grocery Category is required").trim(),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting for GET requests
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`subcategory_get:${clientIP}`, 30, 1 * 60 * 1000)) {
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
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    // Build query - if categoryId is provided, filter by it, otherwise get all subcategories
    const query: any = {};
    if (categoryId) {
      query.groceryCategory = categoryId;
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`subcategory_add:${clientIP}`, 5, 1 * 60 * 1000)) {
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
    const groceryCategory = formData.get("groceryCategory");

    // Validate form data
    const validationResult = subcategorySchema.safeParse({ name, groceryCategory });
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

    let imageUrl = "";

    // Handle image upload if provided
    if (file instanceof Blob) {
      const uploadFormData = new FormData();
      uploadFormData.set("type", "sub_grocery_categories");
      uploadFormData.set("file", file);

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
      imageUrl = uploadResult.url;
    }

    // Check if subcategory already exists for this category
    const existingSubcategory = await SubGroceryCategory.findOne({ 
      name: validationResult.data.name,
      groceryCategory: validationResult.data.groceryCategory
    });
    if (existingSubcategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory with this name already exists for this category",
            code: "SUBCATEGORY_EXISTS"
          },
          { status: 409 }
        )
      );
    }

    // Save subcategory to DB
    const subcategory = new SubGroceryCategory({
      name: validationResult.data.name,
      groceryCategory: validationResult.data.groceryCategory,
      imageUrl: imageUrl || undefined,
    });

    await subcategory.save();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Subcategory created successfully",
          data: {
            id: subcategory._id,
            name: subcategory.name,
            groceryCategory: subcategory.groceryCategory,
            imageUrl: subcategory.imageUrl,
            createdAt: subcategory.createdAt,
            updatedAt: subcategory.updatedAt,
          },
        },
        { status: 201 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`subcategory_update:${clientIP}`, 10, 1 * 60 * 1000)) {
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
    const id = formData.get("id");
    const file = formData.get("file");
    const name = formData.get("name");
    const groceryCategory = formData.get("groceryCategory");

    if (!id) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory ID is required",
            code: "MISSING_ID"
          },
          { status: 400 }
        )
      );
    }

    // Validate form data
    const validationResult = subcategorySchema.safeParse({ name, groceryCategory });
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

    // Check if subcategory exists
    const existingSubcategory = await SubGroceryCategory.findById(id);
    if (!existingSubcategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory not found",
            code: "SUBCATEGORY_NOT_FOUND"
          },
          { status: 404 }
        )
      );
    }

    // Check if name is already taken by another subcategory in the same category
    const nameExists = await SubGroceryCategory.findOne({ 
      name: validationResult.data.name, 
      groceryCategory: validationResult.data.groceryCategory,
      _id: { $ne: id } 
    });
    if (nameExists) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory with this name already exists for this category",
            code: "SUBCATEGORY_EXISTS"
          },
          { status: 409 }
        )
      );
    }

    let imageUrl = existingSubcategory.imageUrl;

    // Handle image upload if provided
    if (file instanceof Blob) {
      const uploadFormData = new FormData();
      uploadFormData.set("type", "sub_grocery_categories");
      uploadFormData.set("file", file);

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
      imageUrl = uploadResult.url;
    }

    // Update subcategory
    const updatedSubcategory = await SubGroceryCategory.findByIdAndUpdate(
      id,
      {
        name: validationResult.data.name,
        groceryCategory: validationResult.data.groceryCategory,
        imageUrl,
      },
      { new: true }
    );

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Subcategory updated successfully",
          data: {
            id: updatedSubcategory?._id,
            name: updatedSubcategory?.name,
            groceryCategory: updatedSubcategory?.groceryCategory,
            imageUrl: updatedSubcategory?.imageUrl,
            createdAt: updatedSubcategory?.createdAt,
            updatedAt: updatedSubcategory?.updatedAt,
          },
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

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`subcategory_delete:${clientIP}`, 5, 1 * 60 * 1000)) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory ID is required",
            code: "MISSING_ID"
          },
          { status: 400 }
        )
      );
    }

    // Check if subcategory exists
    const existingSubcategory = await SubGroceryCategory.findById(id);
    if (!existingSubcategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Subcategory not found",
            code: "SUBCATEGORY_NOT_FOUND"
          },
          { status: 404 }
        )
      );
    }

    // Delete subcategory
    await SubGroceryCategory.findByIdAndDelete(id);

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Subcategory deleted successfully",
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
