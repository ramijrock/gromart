import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Banner document
export interface IBanner extends Document {
  title: string;
  image: string;
  link?: string;
  deviceType: 'web' | 'mobile';
  description: string;
  isactive: boolean;
  vendor: mongoose.Types.ObjectId; // Reference to User (vendor)
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Banner schema
const BannerSchema: Schema = new Schema({
  title: { type: String },
  image: { type: String},
  link: { type: String },
  description: { type: String, trim: true },
  deviceType: { type: String, enum: ['web', 'mobile']},
  isactive: { type: Boolean, default: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date },
  endDate: { type: Date },
}, {
  timestamps: true,
  versionKey: false
});

// Export the model
const Banner = mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
