import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('summary')
  summary(@Req() req: any) {
    return this.service.summary(req.user.tenantId);
  }

  @Get('completion-rate')
  completionRate(@Req() req: any) {
    return this.service.completionRate(req.user.tenantId);
  }

  @Get('by-priority')
  byPriority(@Req() req: any) {
    return this.service.byPriority(req.user.tenantId);
  }

  @Get('by-status')
  byStatus(@Req() req: any) {
    return this.service.byStatus(req.user.tenantId);
  }

  @Get('feed')
  getFeed(@Req() req: any) {
    return this.service.getFeed(req.user.tenantId);
  }

}
