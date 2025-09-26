import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventLog, EventLogDocument, EventType } from './schemas/event-log.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(EventLog.name) private readonly eventModel: Model<EventLogDocument>,
  ) {}

  async record(sessionId: string, type: EventType, payload: Record<string, any> = {}) {
    const created = await this.eventModel.create({ sessionId, type, payload });
    return created.toObject();
  }
}


