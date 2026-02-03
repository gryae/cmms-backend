import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrderPartService {
  constructor(private prisma: PrismaService) {}

  async consumePart(
    tenantId: string,
    workOrderId: string,
    sparePartId: string,
    quantity: number,
  ) {
    if (!quantity || quantity <= 0) {
      throw new BadRequestException('Quantity must be > 0');
    }

    const wo = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!wo || wo.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    const part = await this.prisma.sparePart.findUnique({
      where: { id: sparePartId },
    });

    if (!part || part.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    if (part.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // 🔥 ATOMIC TRANSACTION
    return this.prisma.$transaction([
      this.prisma.workOrderPart.create({
        data: {
          tenantId,
          workOrderId,
          sparePartId,
          quantity,
        },
      }),
      this.prisma.sparePart.update({
        where: { id: sparePartId },
        data: {
          stock: { decrement: quantity },
        },
      }),
    ]);
  }


  async removeUsage(
  tenantId: string,
  usageId: string,
) {
  const usage = await this.prisma.workOrderPart.findUnique({
    where: { id: usageId },
    include: { sparePart: true },
  });

  if (!usage || usage.tenantId !== tenantId) {
    throw new ForbiddenException('Access denied');
  }

  return this.prisma.$transaction([
    this.prisma.workOrderPart.delete({
      where: { id: usageId },
    }),
    this.prisma.sparePart.update({
      where: { id: usage.sparePartId },
      data: {
        stock: {
          increment: usage.quantity, // 🔥 BALIK STOCK
        },
      },
    }),
  ]);
}


  findByWorkOrder(tenantId: string, workOrderId: string) {
    return this.prisma.workOrderPart.findMany({
      where: { tenantId, workOrderId },
      include: { sparePart: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
