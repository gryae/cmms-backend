import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrderCommentsService {
  constructor(private prisma: PrismaService) {}

  async findByWorkOrder(
    tenantId: string,
    workOrderId: string,
  ) {
    const wo = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!wo || wo.tenantId !== tenantId) {
      throw new ForbiddenException();
    }

    return this.prisma.workOrderComment.findMany({
      where: { workOrderId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(
    tenantId: string,
    workOrderId: string,
    userId: string,
    message: string,
  ) {
    const wo = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!wo || wo.tenantId !== tenantId) {
      throw new ForbiddenException();
    }

    return this.prisma.workOrderComment.create({
      data: {
        workOrderId,
        userId,
        message,
      },
    });
  }
}
