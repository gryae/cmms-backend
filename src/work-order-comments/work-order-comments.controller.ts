import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkOrderCommentsService } from './work-order-comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work-orders/:id/comments')
@UseGuards(JwtAuthGuard)
export class WorkOrderCommentsController {
  constructor(private service: WorkOrderCommentsService) {}

  @Get()
  findAll(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.findByWorkOrder(
      req.user.tenantId,
      id,
    );
  }

  @Post()
  create(
    @Req() req: any,
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    return this.service.create(
      req.user.tenantId,
      id,
      req.user.userId,
      message,
    );
  }
}
