import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('event')
  record(@Req() req: any, @Body() body: { type: string; payload?: Record<string, any> }) {
    return this.analyticsService.record(req.sessionId, body.type as any, body.payload || {});
  }
}
