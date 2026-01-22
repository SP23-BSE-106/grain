import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);