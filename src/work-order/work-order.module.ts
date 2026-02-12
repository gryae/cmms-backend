import { Module } from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { WorkOrderController } from './work-order.controller';
import { MailModule } from 'src/mail/mail.module';
import { PushModule } from 'src/notification/push.module';

@Module({
  imports: [MailModule, PushModule],
  providers: [WorkOrderService],
  controllers: [WorkOrderController],
})
export class WorkOrderModule {}
