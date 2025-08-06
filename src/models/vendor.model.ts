import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVendor extends Document {
  // Basic Information
  userId: Types.ObjectId;
  businessName: string;
  businessType: "grocery_store" | "supermarket" | "convenience_store" | "specialty_store" | "online_grocery";
  businessDescription?: string;
  businessLogo?: string;
  businessBanner?: string;
  
  // Contact Information
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Business Details
  taxId?: string;
  gstNumber?: string;
  panNumber?: string;
  businessLicense?: string;
  fssaiLicense?: string;
  
  // Operating Hours
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  
  // Service Settings
  deliverySettings: {
    isDeliveryAvailable: boolean;
    minimumOrderAmount: number;
    deliveryFee: number;
    freeDeliveryThreshold: number;
    maxDeliveryDistance: number; // in kilometers
    estimatedDeliveryTime: number; // in minutes
  };
  
  // Payment Settings
  paymentMethods: {
    cash: boolean;
    card: boolean;
    upi: boolean;
    netBanking: boolean;
    wallet: boolean;
  };
  
  // Categories and Products
  categories: Types.ObjectId[];
  totalProducts: number;
  activeProducts: number;
  
  // Ratings and Reviews
  ratings: {
    average: number;
    count: number;
    totalReviews: number;
  };
  
  // Business Metrics
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  
  // Status and Verification
  isVerified: boolean;
  isActive: boolean;
  isApproved: boolean;
  approvalStatus: "pending" | "approved" | "rejected" | "suspended";
  rejectionReason?: string;
  isKyc: boolean;
  kycStep: "not_started" | "business_details" | "documents" | "bank_details" | "completed";
  
  // Commission and Fees
  commissionRate: number; // percentage
  platformFee: number; // percentage
  
  // Documents
  documents: {
    businessRegistration?: string;
    taxCertificate?: string;
    fssaiCertificate?: string;
    addressProof?: string;
    idProof?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
      bankName: string;
    };
  };
  
  // Settings
  settings: {
    autoAcceptOrders: boolean;
    orderNotification: boolean;
    stockAlert: boolean;
    lowStockThreshold: number;
  };
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  lastActiveAt?: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    // Basic Information
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    businessType: {
      type: String,
      enum: ["grocery_store", "supermarket", "convenience_store", "specialty_store", "online_grocery"],
      required: true,
    },
    businessDescription: {
      type: String,
      maxlength: 500,
    },
    businessLogo: {
      type: String,
    },
    businessBanner: {
      type: String,
    },
    
    // Contact Information
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    alternatePhone: {
      type: String,
    },
    
    // Address Information
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
      postalCode: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    
    // Business Details
    taxId: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },
    businessLicense: { type: String },
    fssaiLicense: { type: String },
    
    // Operating Hours
    operatingHours: {
      monday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
      tuesday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
      wednesday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
      thursday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
      friday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
      saturday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
      sunday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "18:00" },
        isOpen: { type: Boolean, default: true },
      },
    },
    
    // Service Settings
    deliverySettings: {
      isDeliveryAvailable: { type: Boolean, default: true },
      minimumOrderAmount: { type: Number, default: 100 },
      deliveryFee: { type: Number, default: 0 },
      freeDeliveryThreshold: { type: Number, default: 500 },
      maxDeliveryDistance: { type: Number, default: 10 }, // 10km
      estimatedDeliveryTime: { type: Number, default: 45 }, // 45 minutes
    },
    
    // Payment Settings
    paymentMethods: {
      cash: { type: Boolean, default: true },
      card: { type: Boolean, default: true },
      upi: { type: Boolean, default: true },
      netBanking: { type: Boolean, default: false },
      wallet: { type: Boolean, default: false },
    },
    
    // Categories and Products
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    
    // Ratings and Reviews
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    
    // Business Metrics
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    
    // Status and Verification
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    rejectionReason: { type: String },
    isKyc: { type: Boolean, default: false },
    kycStep: {
      type: String,
      enum: ["not_started", "business_details", "documents", "bank_details", "completed"],
      default: "not_started",
    },
    
    // Commission and Fees
    commissionRate: { type: Number, default: 10 }, // 10%
    platformFee: { type: Number, default: 5 }, // 5%
    
    // Documents
    documents: {
      businessRegistration: { type: String },
      taxCertificate: { type: String },
      fssaiCertificate: { type: String },
      addressProof: { type: String },
      idProof: { type: String },
      bankDetails: {
        accountNumber: { type: String },
        ifscCode: { type: String },
        accountHolderName: { type: String },
        bankName: { type: String },
      },
    },
    
    // Settings
    settings: {
      autoAcceptOrders: { type: Boolean, default: false },
      orderNotification: { type: Boolean, default: true },
      stockAlert: { type: Boolean, default: true },
      lowStockThreshold: { type: Number, default: 10 },
    },
    
    // Timestamps
    lastActiveAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
vendorSchema.index({ "address.city": 1 });
vendorSchema.index({ "address.state": 1 });
vendorSchema.index({ businessType: 1 });
vendorSchema.index({ isActive: 1, isApproved: 1 });
vendorSchema.index({ "ratings.average": -1 });
vendorSchema.index({ totalRevenue: -1 });

// Virtual for calculating completion rate
vendorSchema.virtual("orderCompletionRate").get(function() {
  if (this.totalOrders === 0) return 0;
  return (this.completedOrders / this.totalOrders) * 100;
});

// Method to update business metrics
vendorSchema.methods.updateMetrics = function() {
  // This method can be used to update vendor metrics
  // Implementation would depend on order and product data
};

// Pre-save middleware to update lastActiveAt
vendorSchema.pre("save", function(next) {
  this.lastActiveAt = new Date();
  next();
});

const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);

export default Vendor; 