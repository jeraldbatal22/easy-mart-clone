import { Schema, model, models, Types } from "mongoose";

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  // Add other providers as needed
}

const userSchema = new Schema(
  {
    // MongoDB will use _id as the primary key, but we can add a virtual 'id' if needed
    email: { type: String, unique: true, sparse: true, default: null },
    phone: { type: String, unique: true, sparse: true, default: null },
    password: { type: String, default: null },
    googleId: { type: String, unique: true, sparse: true, default: null },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.LOCAL,
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },

    // New fields for names
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },

    // Relations (assuming VerificationCode and RefreshToken are other models)
    verificationCodes: [
      { type: Types.ObjectId, ref: "VerificationCode", default: [] },
    ],
    refreshTokens: [
      { type: Types.ObjectId, ref: "RefreshToken", default: [] },
    ],
  },
  { timestamps: true }
);

// Optionally, add a virtual 'id' field to match Prisma's 'id' property
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Add a virtual for fullName
userSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  if (this.firstName) return this.firstName;
  if (this.lastName) return this.lastName;
  return "";
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = models.User || model("User", userSchema);

export default User;