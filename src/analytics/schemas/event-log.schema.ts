import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventLogDocument = EventLog & Document;

export type EventType = 'product_view' | 'add_to_cart' | 'checkout_start' | 'order_complete';

@Schema({ collection: 'event_logs', versionKey: false, timestamps: true })
export class EventLog {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ required: true })
  type: EventType;

  @Prop({ type: Object, default: {} })
  payload: Record<string, any>;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);


