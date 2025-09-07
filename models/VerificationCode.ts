import { Schema, model, models } from "mongoose";

export enum VerificationType {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  PASSWORD_RESET = "PASSWORD_RESET",
}

const verificationCodeSchema = new Schema(
  {
    // id: Mongoose automatically creates _id field
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 8,
    },
    type: {
      type: String,
      enum: Object.values(VerificationType),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: false, // We'll use our own createdAt field
  }
);

// Add a virtual 'id' field to match Prisma's 'id' property
verificationCodeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
verificationCodeSchema.set("toJSON", { virtuals: true });
verificationCodeSchema.set("toObject", { virtuals: true });

// Index for efficient queries
verificationCodeSchema.index({ userId: 1, type: 1 });
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationCode =
  models.VerificationCode || model("VerificationCode", verificationCodeSchema);

export default VerificationCode;
