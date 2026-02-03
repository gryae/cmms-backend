import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { AssetModule } from './asset/asset.module';
import { WorkOrderModule } from './work-order/work-order.module';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WorkOrderAttachmentsModule } from './work-order-attachments/work-order-attachments.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { WorkOrderPartModule } from './work-order-part/work-order-part.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkOrderCommentsModule } from './work-order-comments/work-order-comments.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 WAJIB
    }),

    PrismaModule,
    TenantModule,
    AuthModule,
    AssetModule,
    WorkOrderModule,
    UserModule,
    DashboardModule,
    WorkOrderAttachmentsModule,
    SparePartModule,
    WorkOrderPartModule,
    ScheduleModule.forRoot(),
    WorkOrderCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

