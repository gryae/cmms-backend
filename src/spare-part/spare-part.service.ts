import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SparePartService {
  constructor(private prisma: PrismaService) {}

  create(
    tenantId: string,
    data: {
      name: string;
      partNumber?: string;
      unit: string;
      stock: number;
      minStock: number;
    },
  ) {
    return this.prisma.sparePart.create({
      data: {
        tenantId,
        name: data.name,
        partNumber: data.partNumber,
        unit: data.unit,
        stock: data.stock,
        minStock: data.minStock,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.sparePart.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async updateStock(
    tenantId: string,
    id: string,
    stock: number,
  ) {
    const part = await this.prisma.sparePart.findUnique({
      where: { id },
    });

    if (!part || part.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.sparePart.update({
      where: { id },
      data: { stock },
    });
  }

  async remove(tenantId: string, id: string) {
    const part = await this.prisma.sparePart.findUnique({
      where: { id },
    });

    if (!part || part.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.sparePart.delete({
      where: { id },
    });
  }
}
