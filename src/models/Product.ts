import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);