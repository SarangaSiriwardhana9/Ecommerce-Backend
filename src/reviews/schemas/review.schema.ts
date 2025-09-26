import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

@Schema({ collection: 'reviews', versionKey: false, timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', index: true, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: '' })
  title?: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: '' })
  authorName?: string;

  @Prop({ default: '' })
  authorEmail?: string;

  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  userId: Types.ObjectId | null;

  @Prop({ default: 'pending' })
  status: ReviewStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);


