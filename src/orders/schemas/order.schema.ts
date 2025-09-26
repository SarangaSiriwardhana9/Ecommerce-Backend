import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

@Schema({ _id: false, versionKey: false })
export class OrderAddress {
  @Prop() line1: string;
  @Prop() line2?: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() postalCode: string;
  @Prop() country: string;
}

export const OrderAddressSchema = SchemaFactory.createForClass(OrderAddress);

@Schema({ _id: false, versionKey: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  variantId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ collection: 'orders', versionKey: false, timestamps: true })
export class Order {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  userId: Types.ObjectId | null;

  @Prop({ required: true })
  shippingName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: OrderAddressSchema, required: true })
  shippingAddress: OrderAddress;

  @Prop()
  notes?: string;

  @Prop({ default: 'COD' })
  paymentMethod: 'COD';

  @Prop({ required: true })
  status: OrderStatus;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: null })
  couponCode: string | null;

  @Prop({ default: null })
  trackingNumber: string | null;

  @Prop({ default: '' })
  internalNotes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
