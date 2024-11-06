const mongoose = require("mongoose");

const storeOwnerSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  ownerPan: {
    type: String,
    required: true,
  },
  panImage: {
    type: String,
  },
  ownerAadhar: {
    type: String,
    required: true,
  },
  aadharImage: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const storeInfoSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  storeAddress: {
    type: String,
    required: true,
  },
  storeEmail: {
    type: String,
  },
  storePhone: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  storeDescription: {
    type: String,
  },
  storeImage: {
    type: String,
    default: null
  },
});

const bankInfoSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  ifscNumber: {
    type: String,
    required: true,
  },
});

const vendorKycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeOwnerInfo: storeOwnerSchema,
    storeInfo: storeInfoSchema,
    bankInfo: bankInfoSchema,
    kycStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    kycStepCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const VendorKYC = mongoose.model("VendorKYC", vendorKycSchema);

module.exports = VendorKYC;
