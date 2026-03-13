import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Priority, WorkOrderStatus } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@Controller('work-orders')
@UseGuards(JwtAuthGuard,RolesGuard)
export class WorkOrderController {
  constructor(private service: WorkOrderService) {}
@Roles('ADMIN', 'SUPERVISOR','USER')
  @Post() 
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId,req.user.userId, {
      title: body.title,
      description: body.description,
      priority: body.priority as Priority,
      assetId: body.assetId,
      assignedTo: body.assignedTo,
      dueDate:body.dueDate,
      unit: body.unit,
    });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.tenantId);
  }

  @Roles('ADMIN', 'SUPERVISOR','USER')
  @Patch(':id/assign')
  assign(
    @Req() req: any,
    @Param('id') id: string,
    @Body('technicianId') technicianId: string,
  ) {
    return this.service.assignTechnician(
      req.user.tenantId,
      id,
      technicianId,
    );
  }

  @Roles('ADMIN', 'SUPERVISOR', 'TECHNICIAN','USER')
  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: WorkOrderStatus,
  ) {
    return this.service.updateStatus(
      req.user.tenantId,
      id,
      status,
      req.user.userId
    );
  }

@Roles('ADMIN', 'SUPERVISOR','USER')
@Delete(':id')
delete(
  @Req() req: any,
  @Param('id') id: string,
) {
  return this.service.delete(
    req.user.tenantId,
    id,
  );
}


@Roles('ADMIN', 'SUPERVISOR','USER')
@Patch(':id')
update(
  @Req() req: any,
  @Param('id') id: string,
  @Body() body: any,
) {
  return this.service.update(
    req.user.tenantId,
    id,
    body,
  );
}



}
