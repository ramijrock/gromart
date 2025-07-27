import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document {
  subCategoryName: string;
  parentCategory: mongoose.Types.ObjectId;
  vendor?: mongoose.Types.ObjectId;
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
  isactive: { type: Boolean, default: true },
  image: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
  slug: { type: String, unique: true, lowercase: true, trim: true }
}, {
  timestamps: true,
  versionKey: false
});

// Pre-save middleware to auto-generate slug if not provided
SubCategorySchema.pre('save', async function(next) {
  const subcategory = this as unknown as ISubCategory;
  if (!subcategory.slug && subcategory.subCategoryName) {
    let baseSlug = subcategory.subCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug exists and generate unique one
    while (true) {
      const existingSubCategory = await mongoose.model('SubCategory').findOne({ slug });
      if (!existingSubCategory || existingSubCategory._id.equals(subcategory._id)) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    subcategory.slug = slug;
  }
  next();
});

const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategory; 