import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private service: TenantService) {}

  @Get()
  findAll(@Req() req: any) {
    return {
      user: req.user,
      data: this.service.findAll(),
    };
  }

  @Post()
  create(@Body('name') name: string) {
    return this.service.create(name);
  }
}
