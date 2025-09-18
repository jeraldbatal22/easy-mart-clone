import { Schema, model, models } from "mongoose";

// Main Grocery Category
export interface CategoryType {
  name: string;
  imageUrl?: string;
}

const groceryCategorySchema = new Schema<CategoryType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

groceryCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
groceryCategorySchema.set("toJSON", { virtuals: true });
groceryCategorySchema.set("toObject", { virtuals: true });

const GroceryCategory = models.GroceryCategory || model("GroceryCategory", groceryCategorySchema);

// Sub Grocery Category
export interface SubGroceryCategoryType {
  name: string;
  groceryCategory: string; // parent category id
  imageUrl?: string;
}

const subGroceryCategorySchema = new Schema<SubGroceryCategoryType>(
  {
    name: { type: String, required: true, trim: true },
    groceryCategory: { type: String, required: true, ref: "GroceryCategory" },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

subGroceryCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
subGroceryCategorySchema.set("toJSON", { virtuals: true });
subGroceryCategorySchema.set("toObject", { virtuals: true });

const SubGroceryCategory =
  models.SubGroceryCategory || model("SubGroceryCategory", subGroceryCategorySchema);

// Sub-Sub Grocery Category
export interface SubSubGroceryCategoryType {
  name: string;
  subGroceryCategory: string; // parent sub category id
  imageUrl?: string;
}

const subSubGroceryCategorySchema = new Schema<SubSubGroceryCategoryType>(
  {
    name: { type: String, required: true, trim: true },
    subGroceryCategory: { type: String, required: true, ref: "SubGroceryCategory" },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

subSubGroceryCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
subSubGroceryCategorySchema.set("toJSON", { virtuals: true });
subSubGroceryCategorySchema.set("toObject", { virtuals: true });

const SubSubGroceryCategory =
  models.SubSubGroceryCategory || model("SubSubGroceryCategory", subSubGroceryCategorySchema);

export {
  GroceryCategory,
  SubGroceryCategory,
  SubSubGroceryCategory,
};
