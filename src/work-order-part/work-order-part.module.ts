import { Module } from '@nestjs/common';
import { WorkOrderPartController } from './work-order-part.controller';
import { WorkOrderPartService } from './work-order-part.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkOrderPartController],
  providers: [WorkOrderPartService, PrismaService],
})
export class WorkOrderPartModule {}
