import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Category document
export interface ICategory extends Document {
  categoryName: string;
  description?: string;
  isactive: boolean;
  image: string;
  icon?: string;
  vendor?: mongoose.Types.ObjectId; // For vendor-specific categories
  isGlobal: boolean; // Whether this category is available to all vendors
  sortOrder: number;
  slug: string; // URL-friendly name
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Category schema
const CategorySchema: Schema = new Schema({
  categoryName: { 
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
  vendor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', // Assuming User model has vendor role
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
CategorySchema.index({ vendor: 1, isGlobal: 1 });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isactive: 1, sortOrder: 1 });

// Ensure virtuals are included when converting to JSON
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// Pre-save middleware to generate slug if not provided
CategorySchema.pre('save', function(next) {
  const category = this as unknown as ICategory;
  if (!category.slug) {
    category.slug = category.categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Export the model
const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;