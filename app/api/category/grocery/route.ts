import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { handleApiError } from "@/lib/auth/errors";
import {
  addSecurityHeaders,
  checkRateLimit,
  getClientIP,
} from "@/lib/auth/security";
import { z } from "zod";
import { GroceryCategory } from "@/models/Category";

const grocerySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`grocery_add:${clientIP}`, 5, 1 * 60 * 1000)) {
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

    const uploadFormData = new FormData();
    uploadFormData.set("type", "grocery_categories")
    uploadFormData.set("file", file as any)
    // Validate form data
    const validationResult = grocerySchema.safeParse({ name });
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
    console.log(uploadResult, "uploadResultuploadResult")
    // if (!uploadResult.success) {
    //   return addSecurityHeaders(
    //     NextResponse.json(
    //       {
    //         success: false,
    //         error: "Upload validation failed",
    //         code: "UPLOAD_VALIDATION_FAILED"
    //       },
    //       { status: 400 }
    //     )
    //   );
    // }

    // Check if category already exists
    const existingCategory = await GroceryCategory.findOne({ name: validationResult.data.name });
    if (existingCategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Category with this name already exists",
            code: "CATEGORY_EXISTS"
          },
          { status: 409 }
        )
      );
    }

    // Save grocery category to DB
    const groceryCategory = new GroceryCategory({
      name,
      imageUrl: uploadResult.url,
    });

    await groceryCategory.save();

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Grocery category created successfully",
          data: {
            id: groceryCategory._id,
            name: groceryCategory.name,
            imageUrl: groceryCategory.imageUrl,
            createdAt: groceryCategory.createdAt,
            updatedAt: groceryCategory.updatedAt,
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
    if (!checkRateLimit(`grocery_get:${clientIP}`, 30, 1 * 60 * 1000)) {
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    // Build query
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get categories with pagination
    const categories = await GroceryCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await GroceryCategory.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return addSecurityHeaders(
      NextResponse.json({
        success: true,
        data: {
          categories,
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

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`grocery_update:${clientIP}`, 10, 1 * 60 * 1000)) {
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

    if (!id) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Category ID is required",
            code: "MISSING_ID"
          },
          { status: 400 }
        )
      );
    }

    // Validate form data
    const validationResult = grocerySchema.safeParse({ name });
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

    // Check if category exists
    const existingCategory = await GroceryCategory.findById(id);
    if (!existingCategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Category not found",
            code: "CATEGORY_NOT_FOUND"
          },
          { status: 404 }
        )
      );
    }

    // Check if name is already taken by another category
    const nameExists = await GroceryCategory.findOne({ 
      name: validationResult.data.name, 
      _id: { $ne: id } 
    });
    if (nameExists) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Category with this name already exists",
            code: "CATEGORY_EXISTS"
          },
          { status: 409 }
        )
      );
    }

    let imageUrl = existingCategory.imageUrl;

    // Handle image upload if provided
    if (file instanceof Blob) {
      const uploadFormData = new FormData();
      uploadFormData.set("type", "grocery_categories");
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

    // Update category
    const updatedCategory = await GroceryCategory.findByIdAndUpdate(
      id,
      {
        name: validationResult.data.name,
        imageUrl,
      },
      { new: true }
    );

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Grocery category updated successfully",
          data: {
            id: updatedCategory?._id,
            name: updatedCategory?.name,
            imageUrl: updatedCategory?.imageUrl,
            createdAt: updatedCategory?.createdAt,
            updatedAt: updatedCategory?.updatedAt,
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
    if (!checkRateLimit(`grocery_delete:${clientIP}`, 5, 1 * 60 * 1000)) {
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
            error: "Category ID is required",
            code: "MISSING_ID"
          },
          { status: 400 }
        )
      );
    }

    // Check if category exists
    const existingCategory = await GroceryCategory.findById(id);
    if (!existingCategory) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Category not found",
            code: "CATEGORY_NOT_FOUND"
          },
          { status: 404 }
        )
      );
    }

    // Delete category
    await GroceryCategory.findByIdAndDelete(id);

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "Grocery category deleted successfully",
        },
        { status: 200 }
      )
    );
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}