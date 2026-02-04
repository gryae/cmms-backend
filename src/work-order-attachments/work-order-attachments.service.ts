import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WorkOrderAttachmentsService {
  constructor(private prisma: PrismaService) {}

  async addAttachment(woId: string, file: Express.Multer.File) {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = path.join(uploadsDir, file.originalname);

    fs.writeFileSync(filePath, file.buffer);
    const baseURL = process.env.APP_URL;
    const fileUrl = `${baseURL}/uploads/${file.originalname}`;
    return this.prisma.workOrderAttachment.create({
      data: {
        workOrderId: woId,
        fileName: file.originalname,
        fileUrl,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  }


async findByWorkOrder(
  tenantId: string,
  workOrderId: string,
) {
  const wo = await this.prisma.workOrder.findUnique({
    where: { id: workOrderId },
  });

  if (!wo || wo.tenantId !== tenantId) {
    throw new ForbiddenException('Access denied');
  }

  const attachments =
    await this.prisma.workOrderAttachment.findMany({
      where: {
        workOrderId,
      },
      orderBy: { createdAt: 'asc' },
    });

  return attachments.map((a) => ({
    id: a.id,
    fileName: a.fileName, // 🔥 FIX
    url: a.fileUrl,       // 🔥 FIX
    mimeType: a.mimeType,
    size: a.size,
  }));
}


}
