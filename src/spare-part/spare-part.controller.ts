import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SparePartService } from './spare-part.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('spare-parts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SparePartController {
  constructor(private service: SparePartService) {}

  @Roles('ADMIN', 'SUPERVISOR')
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId, {
      name: body.name,
      partNumber: body.partNumber,
      unit: body.unit,
      stock: Number(body.stock),
      minStock: Number(body.minStock),
    });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.tenantId);
  }

  @Roles('ADMIN', 'SUPERVISOR')
  @Patch(':id/stock')
  updateStock(
    @Req() req: any,
    @Param('id') id: string,
    @Body('stock') stock: number,
  ) {
    return this.service.updateStock(
      req.user.tenantId,
      id,
      Number(stock),
    );
  }

  @Roles('ADMIN', 'SUPERVISOR')
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.tenantId, id);
  }
}
