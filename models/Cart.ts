import { Schema, model, models, Types } from "mongoose";

export interface CartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number; // Price at time of adding to cart
  originalPrice?: number; // Original price at time of adding to cart
  unit: string;
  name: string; // Product name at time of adding to cart
  image: string; // Product image at time of adding to cart
}

export interface CartType {
  user: Types.ObjectId;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  deliveryFee: number;
  subtotal: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    code?: string;
  };
  appliedCoupon?: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    max: 1000 // Reasonable limit
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  originalPrice: { 
    type: Number, 
    min: 0 
  },
  unit: { 
    type: String, 
    required: true, 
    trim: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  image: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const cartSchema = new Schema<CartType>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true // One cart per user
  },
  items: [cartItemSchema],
  totalItems: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  totalAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  deliveryFee: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  subtotal: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  discount: {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage"
    },
    value: { type: Number, min: 0 },
    code: { type: String, trim: true }
  },
  appliedCoupon: { 
    type: String, 
    trim: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  expiresAt: { 
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, { timestamps: true });

// Virtual for formatted total amount
cartSchema.virtual("formattedTotalAmount").get(function() {
  return `Php ${this.totalAmount.toFixed(2)}`;
});

// Virtual for formatted subtotal
cartSchema.virtual("formattedSubtotal").get(function() {
  return `Php ${this.subtotal.toFixed(2)}`;
});

// Virtual for formatted delivery fee
cartSchema.virtual("formattedDeliveryFee").get(function() {
  return `Php ${this.deliveryFee.toFixed(2)}`;
});

// Virtual for 'id' field
cartSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

// Indexes for better query performance
// cartSchema.index({ user: 1 });
cartSchema.index({ isActive: 1 });
cartSchema.index({ expiresAt: 1 });
cartSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate totals
cartSchema.pre("save", function(next) {
  // Calculate total items
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total amount (sum of all item totals)
  this.totalAmount = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Calculate subtotal (total amount + delivery fee)
  this.subtotal = this.totalAmount + this.deliveryFee;
  
  // Apply discount if exists
  if (this.discount && this.discount.value > 0) {
    if (this.discount.type === "percentage") {
      const discountAmount = (this.totalAmount * this.discount.value) / 100;
      this.subtotal = Math.max(0, this.subtotal - discountAmount);
    } else if (this.discount.type === "fixed") {
      this.subtotal = Math.max(0, this.subtotal - this.discount.value);
    }
  }
  
  next();
});

// Static method to find or create cart for user
cartSchema.statics.findOrCreate = async function(userId: string) {
  let cart = await this.findOne({ user: userId, isActive: true });
  
  if (!cart) {
    cart = await this.create({ 
      user: userId,
      items: [],
      deliveryFee: 5.78 // Default delivery fee
    });
  }
  
  return cart;
};

// Instance method to add item to cart
cartSchema.methods.addItem = async function(_productId: string, _quantity: number = 1) {
  // This will be implemented in the service layer
  return this;
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = async function(_productId: string) {
  // This will be implemented in the service layer
  return this;
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = async function(_productId: string, _quantity: number) {
  // This will be implemented in the service layer
  return this;
};

// Instance method to clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.totalItems = 0;
  this.totalAmount = 0;
  this.subtotal = 0;
  this.discount = undefined;
  this.appliedCoupon = undefined;
  return this.save();
};

const Cart = models.Cart || model("Cart", cartSchema);

export default Cart;
