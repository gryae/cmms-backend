import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Parser } from 'json2csv';
import { parse } from 'csv-parse/sync';
import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import csv from 'csv-parser';
@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  // ================= CREATE =================
  create(
    tenantId: string,
    data: {
      name: string;
      code: string;
      branch: string;
      location: string;
      procurementYear: number;
      category?: string;
    },
  ) {
    return this.prisma.asset.create({
      data: {
        tenantId,
        name: data.name,
        code: data.code,
        branch: data.branch,
        location: data.location,
        procurementYear: data.procurementYear,
        category: data.category,
      },
    });
  }

  // ================= LIST =================
  findAll(tenantId: string) {
    return this.prisma.asset.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ================= DETAIL =================
  findOne(tenantId: string, id: string) {
    return this.prisma.asset.findFirst({
      where: { id, tenantId },
      include: {
        workOrders: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });
  }

  // ================= UPDATE =================
  async update(
    tenantId: string,
    id: string,
    data: {
      name: string;
      code: string;
      branch: string;
      location: string;
      procurementYear: number;
      category?: string;
    },
  ) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!asset) {
      throw new ForbiddenException('Asset not found');
    }

    return this.prisma.asset.update({
      where: { id },
      data,
    });
  }

  // ================= DELETE (SAFE) =================
  async delete(tenantId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
      include: {
        workOrders: true,
      },
    });

    if (!asset) {
      throw new ForbiddenException('Asset not found');
    }

    if (asset.workOrders.length > 0) {
      throw new ForbiddenException(
        'Cannot delete asset that is used in work orders',
      );
    }

    return this.prisma.asset.delete({
      where: { id },
    });
  }




  async exportCsv(tenantId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { tenantId },
      select: {
        name: true,
        code: true,
        branch: true,
        location: true,
        procurementYear: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const parser = new Parser({
      fields: ['name', 'code', 'branch', 'location', 'procurementYear'],
    });

    return parser.parse(assets);
  } 









  /////////BULK IMPORT/////////////////////

// ================= IMPORT CSV (🔥 FIXED & STABLE) =================
  async importCsv(tenantId: string, buffer: Buffer) {
    const content = buffer.toString('utf8');

    const records: any[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      bom: true, // 🔥 HANDLE BOM
      trim: true,
      delimiter: [',', '\t', ';']
    });

    let created = 0;
    let skipped = 0;

    const normalize = (v?: any) =>
      v === undefined || v === null
        ? ''
        : String(v).trim();

    for (const row of records) {
      
      const name = normalize(row.name);
      const code = normalize(row.code);
      const branch = normalize(row.branch);
      const location = normalize(row.location);
      const procurementYear = Number(
        normalize(row.procurementYear),
      );
      const category = normalize(row.category) || 'GENERAL';

      // 🔒 BASIC VALIDATION
      if (!name || !code || !branch || !procurementYear) {
        skipped++;
        continue;
      }

      // 🔁 DUPLICATE CHECK (PER TENANT)
      const exists = await this.prisma.asset.findFirst({
        where: {
          tenantId,
          code,
        },
      });

      if (exists) {
        skipped++;
        continue;
      }

      // ✅ CREATE
      await this.prisma.asset.create({
        data: {
          tenantId,
          name,
          code,
          branch,
          location,
          procurementYear,
          category,
        },
      });

      created++;
    }

    return {
      created,
      skipped,
      total: records.length,
    };
  }
}
