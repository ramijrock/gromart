const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, require: true },
    mobile: { type: Number, require: true, unique: true },
    password: { type: String, require: true },
    terms_and_conditions: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      required: true,
      enum: ["customer", "vendor", "delivery_boy"],
      default: "customer",
    },
    profile_picture: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = userSchema;
