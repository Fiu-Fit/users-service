import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersMetricsQueryDTO } from './dto';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('login')
  getLoginMetrics(@Query() filter: GetUsersMetricsQueryDTO) {
    return this.metricsService.getLoginMetrics(filter);
  }

  @Get('register')
  getRegisterMetrics(@Query() filter: GetUsersMetricsQueryDTO) {
    return this.metricsService.getRegisterMetrics(filter);
  }

  @Get('blocked')
  getBlockedMetrics() {
    return this.metricsService.getBlockedMetrics();
  }
}
