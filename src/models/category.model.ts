import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Category document
export interface ICategory extends Document {
  categoryname: string;
  isactive: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Category schema
const CategorySchema: Schema = new Schema({
  categoryname: { type: String, required: true },
  isactive: { type: Boolean, default: true },
  image: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false
});

// Export the model
const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;