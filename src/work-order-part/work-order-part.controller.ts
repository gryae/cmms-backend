import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkOrderPartService } from './work-order-part.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('work-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkOrderPartController {
  constructor(private service: WorkOrderPartService) {}

  @Roles('ADMIN', 'SUPERVISOR', 'TECHNICIAN')
  @Post(':id/parts')
  consume(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.consumePart(
      req.user.tenantId,
      id,
      body.sparePartId,
      Number(body.quantity),
    );
  }


  

  @Get(':id/parts')
  findByWO(@Req() req: any, @Param('id') id: string) {
    return this.service.findByWorkOrder(
      req.user.tenantId,
      id,
    );
  }

@Roles('ADMIN', 'SUPERVISOR', 'TECHNICIAN')
@Delete('parts/:usageId')
remove(
  @Req() req: any,
  @Param('usageId') usageId: string,
) {
  return this.service.removeUsage(
    req.user.tenantId,
    usageId,
  );
}





}


