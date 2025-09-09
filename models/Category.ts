import { Schema, model, models } from "mongoose";

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

// Optionally, add a virtual 'id' field to match Prisma's 'id' property
groceryCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
groceryCategorySchema.set("toJSON", { virtuals: true });
groceryCategorySchema.set("toObject", { virtuals: true });

const GroceryCategory = models.GroceryCategory || model("GroceryCategory", groceryCategorySchema);

export { GroceryCategory };
