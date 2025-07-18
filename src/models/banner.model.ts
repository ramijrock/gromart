import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Banner document
export interface IBanner extends Document {
  title: string;
  image: string;
  link?: string;
  deviceType: 'web' | 'mobile';
  isactive: boolean;
  vendor: mongoose.Types.ObjectId; // Reference to User (vendor)
  createdAt: Date;
  updatedAt: Date;
}

// Define the Banner schema
const BannerSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
  deviceType: { type: String, enum: ['web', 'mobile'], required: true },
  isactive: { type: Boolean, default: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
  versionKey: false
});

// Export the model
const Banner = mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
