import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkOrderStatus, Priority } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}



  async summary(tenantId: string) {
    const now = new Date();
    //console.log(now);
    const debug = await this.prisma.workOrder.findMany({
      where: {
        tenantId,
        dueDate:{
          not:null,
          lt: new Date(),
        }
      },
      select: {
        id:true,
        status:true,
        dueDate:true,
      }
    });
    //console.log('DEBUG OVERDUE WOs:', debug);

    const [
      total,
      open,
      inProgress,
      done,
      overdue,
    ] = await Promise.all([
      
      this.prisma.workOrder.count({ where: { tenantId } }),
      this.prisma.workOrder.count({
        where: { tenantId, status: WorkOrderStatus.OPEN },
      }),
      this.prisma.workOrder.count({
        where: { tenantId, status: WorkOrderStatus.IN_PROGRESS },
      }),
      this.prisma.workOrder.count({
        where: { tenantId, status: WorkOrderStatus.DONE },
      }),
      this.prisma.workOrder.count({
        where: {
          tenantId,
          status: { in: [WorkOrderStatus.OPEN, WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS] },
          dueDate: { not:null, lt: new Date() },
        },
      }),
    ]);

    return { total, open, inProgress, done, overdue };
  }

  async completionRate(tenantId: string) {
    const total = await this.prisma.workOrder.count({ where: { tenantId } });
    if (total === 0) return { completionRate: 0 };

    const completed = await this.prisma.workOrder.count({
      where: { tenantId, status: WorkOrderStatus.DONE },
    });

    return {
      completionRate: Math.round((completed / total) * 100),
    };
  }

  async byPriority(tenantId: string) {
    const result = await this.prisma.workOrder.groupBy({
      by: ['priority'],
      where: { tenantId },
      _count: true,
    });

    // normalize output
    const map: Record<Priority, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      EMERGENCY: 0,
    };

    result.forEach(r => {
      map[r.priority] = r._count;
    });

    return map;
  }

  async byStatus(tenantId: string) {
    const result = await this.prisma.workOrder.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: true,
    });

    const map: Record<WorkOrderStatus, number> = {
      OPEN: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      DONE: 0,
      OVERDUE:0,
    };

    result.forEach(r => {
      map[r.status] = r._count;
    });

    return map;
  }



  async getFeed(tenantId: string) {
  const [workOrders, comments] = await Promise.all([
    this.prisma.workOrder.findMany({
      where: { tenantId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status:true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),

    this.prisma.workOrderComment.findMany({
      where: {
        workOrder: { tenantId },
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        user: { select: { email: true } },
        workOrder: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  const woEvents = workOrders.map((wo) => ({
    id: `wo-${wo.id}`,
    type: 'work_order_created',
    workOrderId: wo.id, // ✅ PENTING
    message: `Work Order "${wo.title}" was created`,
    timestamp: wo.createdAt,
  }));

  const statusEvents = workOrders
    .filter((wo) => wo.status !== 'OPEN')
    .map((wo) => ({
      id: `wo-status-${wo.id}`,
      type: 'status_changed',
      workOrderId: wo.id, // ✅ PENTING
      message: `Work Order "${wo.title}" status changed to ${wo.status}`,
      timestamp: wo.createdAt,
    }));

  const commentEvents = comments.map((c) => ({
    id: `comment-${c.id}`,
    type: 'comment',
    workOrderId: c.workOrder.id, // ✅ PENTING
    message: `${c.user.email} commented on "${c.workOrder.title}" - "${c.message}"`,
    timestamp: c.createdAt,
  }));

  return [...woEvents, ...commentEvents, ...statusEvents]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )
    .slice(0, 30);
}


}
