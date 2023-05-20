import { Controller, Get, Query } from '@nestjs/common';
import { GetAuthMetricsQueryDTO } from './dto';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('login')
  getLoginMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getLoginMetrics(filter);
  }

  @Get('register')
  getRegisterMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getRegisterMetrics(filter);
  }
}
