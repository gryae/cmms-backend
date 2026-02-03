import { Module } from '@nestjs/common';
import { SparePartController } from './spare-part.controller';
import { SparePartService } from './spare-part.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SparePartController],
  providers: [SparePartService, PrismaService],
})
export class SparePartModule {}
