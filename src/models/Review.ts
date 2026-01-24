import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);