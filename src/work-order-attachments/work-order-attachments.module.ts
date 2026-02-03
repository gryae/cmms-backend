import { Module } from '@nestjs/common';
import { WorkOrderAttachmentsController } from './work-order-attachments.controller';
import { WorkOrderAttachmentsService } from './work-order-attachments.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkOrderAttachmentsController],
  providers: [WorkOrderAttachmentsService, PrismaService],
})
export class WorkOrderAttachmentsModule {}
