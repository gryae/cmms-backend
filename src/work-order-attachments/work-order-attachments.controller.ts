import {
  Controller,
  Post,
  Get,
  Req,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorkOrderAttachmentsService } from './work-order-attachments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('work-orders')
@UseGuards(JwtAuthGuard, RolesGuard) // 🔥 INI YANG HILANG
export class WorkOrderAttachmentsController {
  constructor(
    private readonly service: WorkOrderAttachmentsService,
  ) {}

  @Roles('ADMIN', 'SUPERVISOR', 'TECHNICIAN')
  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file',{
    limits: {
       fileSize: 1 * 1024 * 1024, 
      }, // 1MB
  }),
)
  upload(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // kalau mau, nanti bisa validasi tenant di service
    return this.service.addAttachment(id, file);
  }

  @Roles('ADMIN', 'SUPERVISOR', 'TECHNICIAN')
  @Get(':id/attachments')
  getByWorkOrder(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.findByWorkOrder(
      req.user.tenantId, // ✅ SEKARANG AMAN
      id,
    );
  }
}
