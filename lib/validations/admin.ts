import { z } from "zod";

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Category name must be less than 100 characters"),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Subcategory validation schema
export const subcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required").max(100, "Subcategory name must be less than 100 characters"),
  groceryCategory: z.string().min(1, "Please select a category"),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
});

export type SubcategoryFormData = z.infer<typeof subcategorySchema>;

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().min(0.01, "Original price must be greater than 0").optional(),
  unit: z.string().min(1, "Unit is required").max(50, "Unit must be less than 50 characters"),
  stock: z.number().min(0, "Stock must be 0 or greater"),
  stockLabel: z.string().max(100, "Stock label must be less than 100 characters").optional(),
  groceryCategory: z.string().min(1, "Please select a category"),
  subGroceryCategory: z.string().min(1, "Please select a subcategory"),
  isBestSeller: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  featured: z.boolean().default(false),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountPercentage: z.number().min(0).max(100).optional(),
  discountValue: z.number().min(0).optional(),
  tags: z.string().optional(),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  imageFile: z.union([z.instanceof(File), z.null()]).optional(),
  imageUrl: z.string().optional(),
}).refine((data) => {
  // If discount type is percentage, discountPercentage should be provided
  if (data.discountType === "percentage" && data.discountPercentage === undefined) {
    return false;
  }
  // If discount type is fixed, discountValue should be provided
  if (data.discountType === "fixed" && data.discountValue === undefined) {
    return false;
  }
  return true;
}, {
  message: "Discount value is required when discount type is selected",
  path: ["discountPercentage"],
});

export type ProductFormData = z.infer<typeof productSchema>;

// Create category schema (requires image file)
export const createCategorySchema = categorySchema.refine(
  (data) => data.imageFile || data.imageUrl,
  {
    message: "Category image is required",
    path: ["imageFile"],
  }
);

// Create subcategory schema (requires image file)
export const createSubcategorySchema = subcategorySchema.refine(
  (data) => data.imageFile || data.imageUrl,
  {
    message: "Subcategory image is required",
    path: ["imageFile"],
  }
);

// Create product schema (requires image file)
export const createProductSchema = productSchema.refine(
  (data) => data.imageFile || data.imageUrl,
  {
    message: "Product image is required",
    path: ["imageFile"],
  }
);
