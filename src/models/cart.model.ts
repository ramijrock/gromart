import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for cart item
export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  discount: number; // percentage
  finalPrice: number;
}

// Interface for cart document
export interface ICart extends Document {
  userId: Types.ObjectId;
  vendorId?: Types.ObjectId;
  items: ICartItem[];
  cartTotal: number;
  itemCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0, // percent
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    cartTotal: {
      type: Number,
      default: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Automatically update total and count
cartSchema.pre("save", function (next) {
  let total = 0;
  let count = 0;

  this.items.forEach((item) => {
    item.finalPrice = item.price - (item.price * item.discount) / 100;
    total += item.finalPrice * item.quantity;
    count += item.quantity;
  });

  this.cartTotal = total;
  this.itemCount = count;

  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
