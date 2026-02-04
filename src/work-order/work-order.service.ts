import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Priority, WorkOrderStatus } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class WorkOrderService {
  constructor(private prisma: PrismaService,
    private mailService: MailService,
  ) {}

private async sendAssignEmail(params: {
  tenantId: string;
  wo: any;
  technicianId: string;
}) {
  const { tenantId, wo, technicianId } = params;

  const technician = await this.prisma.user.findUnique({
    where: { id: technicianId },
    select: { email: true },
  });
  if (!technician) return;

  if (!wo.createdBy) return;

  const creator = await this.prisma.user.findUnique({
    where: { id: wo.createdBy },
    select: { email: true },
  });
  if (!creator) return;

  const admins = await this.prisma.user.findMany({
    where: { tenantId, role: 'ADMIN' },
    select: { email: true },
  });

   this.mailService.sendWorkOrderAssigned({
    to: [
      technician.email,
      creator.email,
      ...admins.map(a => a.email),
    ],
    title: wo.title,
    technician: technician.email,
    creatorEmail: creator.email,
    asset: wo.asset?.name ?? undefined,
    dueDate: wo.dueDate
      ? wo.dueDate.toDateString()
      : undefined,
    workOrderId: wo.id,
  });
}





 async create(
  tenantId: string,
  creatorUserId: string,
  data: {
    title: string;
    description?: string;
    priority: Priority;
    assetId?: string;
    assignedTo?: string;
    dueDate?: string;
  },
) {
  const status = data.assignedTo
    ? WorkOrderStatus.ASSIGNED
    : WorkOrderStatus.OPEN;

  // 🔹 Ambil creator user
 const creator = await this.prisma.user.findUnique({
  where: { id: creatorUserId },
  select: { email: true },
});

if (!creator) {
  throw new Error('Creator user not found');
}
const wo = await this.prisma.workOrder.create({
  data: {
    tenantId,
    title: data.title,
    description: data.description,
    priority: data.priority,
    assetId: data.assetId,
    assignedTo: data.assignedTo,
    status,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    createdBy:creatorUserId,
  },
  include: {
    asset: true,
  },
});

// ambil admin
const admins = await this.prisma.user.findMany({
  where: { tenantId, role: 'ADMIN' },
  select: { email: true },
});

this.mailService.sendWorkOrderCreated({
  to: [
    ...admins.map(a => a.email),
    creator.email,
  ],
  title: wo.title,
  priority: wo.priority,
  creator: creator.email,
  asset: wo.asset?.name,
  dueDate: wo.dueDate?.toDateString(),
  workOrderId: wo.id,
})
.catch(err=>console.warn('Failed to send work order created email:', err.message));

if (data.assignedTo){ 
   this.sendAssignEmail({
    tenantId,
    wo,
    technicianId: data.assignedTo,
  })
}


  return wo;
}


  findAll(tenantId: string) {
    return this.prisma.workOrder.findMany({
      where: { tenantId },
      include: {
        asset: true,
        assignee: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

async assignTechnician(
  tenantId: string,
  workOrderId: string,
  technicianId: string,
  
) {
  const wo = await this.prisma.workOrder.findUnique({
    where: { id: workOrderId },
    include: { asset: true },
  });

  if (!wo || wo.tenantId !== tenantId) {
    throw new ForbiddenException('Access denied');
  }

  const technician = await this.prisma.user.findUnique({
    where: { id: technicianId },
    select: { email: true },
  });

  if (!technician) {
    throw new Error('Technician not found');
  }

if (!wo.createdBy) {
  throw new Error('Work order creator not found');
}

const creator = await this.prisma.user.findUnique({
  where: { id: wo.createdBy },
  select: { email: true },
});

if (!creator) {
  throw new Error('Creator not found');
}


  if (!creator) {
    throw new Error('Creator not found');
  }

  const admins = await this.prisma.user.findMany({
    where: { tenantId, role: 'ADMIN' },
    select: { email: true },
  });

  const updated = await this.prisma.workOrder.update({
    where: { id: workOrderId },
    data: {
      assignedTo: technicianId,
      status: WorkOrderStatus.ASSIGNED,
    },
  });
console.log('ASSIGN EMAIL DATA:', {
  technician: technician.email,
  creator: creator.email,
  admins: admins.map(a => a.email),
});

   this.sendAssignEmail({
    tenantId,
    wo: updated,
    technicianId,
  });

  return updated;
}



  async updateStatus(
  tenantId: string,
  workOrderId: string,
  status: WorkOrderStatus,
) {
  const wo = await this.prisma.workOrder.findUnique({
    where: { id: workOrderId },
    include: {
      asset: true,
      assignee: { select: { email: true } },
    },
  });

  if (!wo || wo.tenantId !== tenantId) {
    throw new ForbiddenException('Access denied');
  }

  const updated = await this.prisma.workOrder.update({
    where: { id: workOrderId },
    data: { status },
  });

  // 🔔 KIRIM EMAIL JIKA DONE
  if (status === WorkOrderStatus.DONE) {
    // creator
    const creator = wo.createdBy
      ? await this.prisma.user.findUnique({
          where: { id: wo.createdBy },
          select: { email: true },
        })
      : null;

    // admin
    const admins = await this.prisma.user.findMany({
      where: { tenantId, role: 'ADMIN' },
      select: { email: true },
    });

    const emails = [
      ...admins.map(a => a.email),
      creator?.email,
      wo.assignee?.email,
    ].filter(Boolean) as string[];

     this.mailService.sendWorkOrderDone({
      to: emails,
      title: wo.title,
      technician: wo.assignee?.email ?? 'Technician',
      creator: creator?.email ?? 'Creator',
      asset: wo.asset?.name,
      workOrderId: wo.id,
    })
    .catch(err=>console.warn('Failed to send work order done email:', err.message));
  }

  return updated;
}


  async delete(
  tenantId: string,
  workOrderId: string,
) {
  const wo = await this.prisma.workOrder.findUnique({
    where: { id: workOrderId },
    include: {
      parts: true,
      attachments: true, // 🔥 TAMBAH INI
    },
  });

  if (!wo || wo.tenantId !== tenantId) {
    throw new ForbiddenException('Access denied');
  }

  // ❌ spare part rule tetap
  if (wo.parts.length > 0) {
    throw new ForbiddenException(
      'Cannot delete work order with used spare parts',
    );
  }

  // 🔥 HAPUS FILE FISIK + DB ATTACHMENT
  for (const a of wo.attachments) {
    try {
      const filePath = a.fileUrl.replace(
        'http://localhost:3001',
        process.cwd(),
      );
      if (require('fs').existsSync(filePath)) {
        require('fs').unlinkSync(filePath);
      }
    } catch {}
  }

  // 🔥 DELETE ATTACHMENT RECORD
  await this.prisma.workOrderAttachment.deleteMany({
    where: { workOrderId },
  });

  // DELETE COMMENT RECORD
  await this.prisma.workOrderComment.deleteMany({
    where: { workOrderId}
  })

  // 🔥 BARU DELETE WO
  return this.prisma.workOrder.delete({
    where: { id: workOrderId },
  });
}


async update(
  tenantId: string,
  workOrderId: string,
  data: {
    title?: string;
    description?: string;
    priority?: Priority;
    assetId?: string | null;
    assignedTo?: string | null;
    dueDate?: string | null;
    status?: WorkOrderStatus;
  },
) {
  const wo = await this.prisma.workOrder.findUnique({
    where: { id: workOrderId },
    include: { asset: true },
  });

  if (!wo || wo.tenantId !== tenantId) {
    throw new ForbiddenException('Access denied');
  }

  const prevAssigned = wo.assignedTo;
  const nextAssigned =
    data.assignedTo === ''
      ? null
      : data.assignedTo ?? prevAssigned;

  const updated = await this.prisma.workOrder.update({
    where: { id: workOrderId },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assetId: data.assetId === '' ? null : data.assetId ?? undefined,
      assignedTo: nextAssigned,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : data.dueDate === null
        ? null
        : undefined,
      status: data.status,
    },
  });

  // 🔥 KIRIM EMAIL HANYA JIKA:
  // - sebelumnya kosong
  // - atau berubah technician
  if (
    nextAssigned &&
    nextAssigned !== prevAssigned
  ) {
     this.sendAssignEmail({
      tenantId,
      wo: { ...wo, assignedTo: nextAssigned },
      technicianId: nextAssigned,
    });
  }

  return updated;
}





}
