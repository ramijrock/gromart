import mongoose, { Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  images: { url: string; alt?: string }[];
  price: number;
  discount: number;
  finalPrice: number;
  categoryId: Types.ObjectId;
  subCategoryId?: Types.ObjectId;
  vendorId: Types.ObjectId;
  stockQty: number;
  unit: "kg" | "g" | "liter" | "ml" | "pcs" | "box" | "packet";
  isAvailable: boolean;
  tags: string[];
  variants: { name: string; price: number; stockQty: number }[];
  ratings: { average: number; count: number };
  isFeatured: boolean;
  isDeleted: boolean;
  totalSold: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100, // Prevent discounts over 100%
    },
    finalPrice: {
      type: Number,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ["kg", "g", "liter", "ml", "pcs", "box", "packet"],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: [String], // for search and filters
    variants: [
      {
        name: String, // e.g., "1kg", "500g", "Combo Pack"
        price: Number,
        stockQty: Number,
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    totalSold: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

// Auto-calculate finalPrice before save
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

// Export the model
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
