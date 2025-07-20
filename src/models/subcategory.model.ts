import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document {
  subCategoryName: string;
  parentCategory: mongoose.Types.ObjectId;
  vendor?: mongoose.Types.ObjectId;
  isGlobal: boolean;
  isactive: boolean;
  image: string;
  sortOrder: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema: Schema = new Schema({
  subCategoryName: { type: String, required: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  isGlobal: { type: Boolean, default: true },
  isactive: { type: Boolean, default: true },
  image: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
  slug: { type: String, unique: true, lowercase: true, trim: true }
}, {
  timestamps: true,
  versionKey: false
});

// Pre-save middleware to auto-generate slug if not provided
SubCategorySchema.pre('save', function(next) {
  const subcategory = this as unknown as ISubCategory;
  if (!subcategory.slug && subcategory.subCategoryName) {
    subcategory.slug = subcategory.subCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens
  }
  next();
});

const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategory; 