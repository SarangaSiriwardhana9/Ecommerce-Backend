import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type UserRole = 'customer' | 'admin';

@Schema({ collection: 'users', versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'customer' })
  role: UserRole;

  @Prop({ default: '' })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
