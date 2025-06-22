import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: number;
  password: string;
  isactive?: boolean;
  termsandcondition?: boolean;
  image?: string;
  nickname?: string;
  dob?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  pin?: number;
  otp?: string;
  role?: "customer" | "vendor" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    isactive: { type: Boolean, default: true },
    termsandcondition: { type: Boolean, default: true },
    image: { type: String },
    nickname: { type: String },
    dob: { type: String },
    gender: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    pin: { type: Number },
    otp: { type: String },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
