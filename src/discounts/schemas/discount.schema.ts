import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiscountDocument = Discount & Document;

export type DiscountType = 'percentage' | 'fixed';

@Schema({ collection: 'discounts', versionKey: false, timestamps: true })
export class Discount {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, enum: ['percentage', 'fixed'] })
  type: DiscountType;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ type: [Types.ObjectId], default: [] })
  appliesToProductIds: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  appliesToCategoryIds: Types.ObjectId[];

  @Prop({ default: false })
  appliesToOrder: boolean;

  @Prop({ default: 0 })
  minOrderValue: number;

  @Prop({ default: null })
  maxUses: number | null;

  @Prop({ default: null })
  validFrom: Date | null;

  @Prop({ default: null })
  validTo: Date | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  usedCount: number;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);


