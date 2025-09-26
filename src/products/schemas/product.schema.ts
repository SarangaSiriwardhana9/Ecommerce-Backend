import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: true, versionKey: false, timestamps: true })
export class ProductImage {
  @Prop({ required: true })
  url: string;

  @Prop({ default: '' })
  altText: string;

  @Prop({ default: false })
  isMain: boolean;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema({ _id: true, versionKey: false })
export class VariantAttributes {
  @Prop({ default: '' })
  size: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ default: '' })
  material: string;
}

export const VariantAttributesSchema = SchemaFactory.createForClass(VariantAttributes);

@Schema({ _id: true, versionKey: false })
export class ProductVariant {
  @Prop({ required: true, unique: false })
  variantId: string;

  @Prop({ type: VariantAttributesSchema })
  attributes: VariantAttributes;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop()
  imageUrl?: string;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

@Schema({ collection: 'products', versionKey: false, timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  mainDescription: string;

  @Prop({ default: '' })
  subDescription: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ type: [String], index: true })
  tags: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], index: true })
  categoryIds: Types.ObjectId[];

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[];

  @Prop({ type: [ProductImageSchema], default: [] })
  images: ProductImage[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  discountPrice?: number;

  @Prop({ default: false, index: true })
  archived: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ title: 'text', mainDescription: 'text', tags: 'text' });
