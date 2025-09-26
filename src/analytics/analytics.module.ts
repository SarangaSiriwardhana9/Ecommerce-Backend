import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { EventLog, EventLogSchema } from './schemas/event-log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: EventLog.name, schema: EventLogSchema }])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
