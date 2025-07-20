import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document {
  subCategoryName: string;
  description?: string;
  isactive: boolean;
  image: string;
  icon?: string;
  parentCategory: mongoose.Types.ObjectId; // Reference to Category
  vendor?: mongoose.Types.ObjectId; // For vendor-specific subcategories
  isGlobal: boolean;
  sortOrder: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema: Schema = new Schema({
  subCategoryName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isactive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isGlobal: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
SubCategorySchema.index({ vendor: 1, isGlobal: 1 });
SubCategorySchema.index({ parentCategory: 1 });
SubCategorySchema.index({ slug: 1 });
SubCategorySchema.index({ isactive: 1, sortOrder: 1 });

// Pre-save middleware to generate slug if not provided
SubCategorySchema.pre('save', function(next) {
  const subcategory = this as unknown as ISubCategory;
  if (!subcategory.slug) {
    subcategory.slug = subcategory.subCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategory; 