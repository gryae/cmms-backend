import { Module } from '@nestjs/common';
import { WorkOrderCommentsService } from './work-order-comments.service';
import { WorkOrderCommentsController } from './work-order-comments.controller';

@Module({
  providers: [WorkOrderCommentsService],
  controllers: [WorkOrderCommentsController]
})
export class WorkOrderCommentsModule {}
