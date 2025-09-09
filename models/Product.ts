import { Schema, model, models } from "mongoose";

export interface ProductType {
  name: string;
  description?: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit: string; // e.g., "5c/rb", "kg", "lb", "each"
  stock: number;
  stockLabel: string; // e.g., "12 Left", "In Stock", "Out of Stock"
  groceryCategory: string; // Reference to groceryCategory
  isBestSeller?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  discount?: {
    percentage?: number;
    type?: "percentage" | "fixed";
    value?: number;
  };
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  isActive: boolean;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductType>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    unit: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    stockLabel: { type: String, required: true, trim: true },
    groceryCategory: { type: String, required: true, ref: "groceryCategory" },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    discount: {
      percentage: { type: Number, min: 0, max: 100 },
      type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
      value: { type: Number, min: 0 }
    },
    tags: [{ type: String, trim: true }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    },
    nutritionalInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 }
    },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Virtual for discount percentage calculation
productSchema.virtual("discountPercentage").get(function() {
  if (this.originalPrice && this.price < this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for formatted price
productSchema.virtual("formattedPrice").get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted original price
productSchema.virtual("formattedOriginalPrice").get(function() {
  return this.originalPrice ? `$${this.originalPrice.toFixed(2)}` : null;
});

// Virtual for 'id' field
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Indexes for better query performance
productSchema.index({ groceryCategory: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ createdAt: -1 }); // For sorting by newest
productSchema.index({ rating: -1 }); // For sorting by rating
productSchema.index({ stock: 1 }); // For inventory management
productSchema.index({ featured: 1, isActive: 1 }); // Compound index for featured products
productSchema.index({ groceryCategory: 1, isActive: 1, price: 1 }); // Compound index for groceryCategory filtering

// Pre-save middleware for validation and auto-calculation
productSchema.pre("save", function(next) {
  // Auto-calculate discount percentage if not set
  if (this.originalPrice && this.price < this.originalPrice && !this.discount?.percentage) {
    this.discount = this.discount || {};
    this.discount.percentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  // Auto-generate stock label if not set
  if (!this.stockLabel) {
    if (this.stock === 0) {
      this.stockLabel = "Out of Stock";
    } else if (this.stock <= 10) {
      this.stockLabel = `${this.stock} Left`;
    } else {
      this.stockLabel = "In Stock";
    }
  }

  // // Ensure rating is within bounds
  // if (this.rating < 0) this.rating = 0;
  // if (this.rating > 5) this.rating = 5;

  // // Ensure review count is not negative
  // if (this.reviewCount < 0) this.reviewCount = 0;

  next();
});

const Product = models.Product || model("Product", productSchema);

export default Product;