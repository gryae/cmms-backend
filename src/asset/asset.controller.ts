import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
  Res,
  Header,
  StreamableFile,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  
} from '@nestjs/common';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { AssetService } from './asset.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetController {
  constructor(private service: AssetService) {}

  // ================= CREATE =================
  @Roles('ADMIN', 'SUPERVISOR','USER','TECHNICIAN')
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId, {
      name: body.name,
      code: body.code,
      branch: body.branch,
      location: body.location,
      procurementYear: Number(body.procurementYear),
      category: body.category,
    });
  }

  // ================= LIST =================
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.tenantId);
  }

  // ================= DETAIL =================
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.tenantId, id);
  }

  // ================= UPDATE =================
  @Roles('ADMIN', 'SUPERVISOR','USER','TECHNICIAN')
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.update(req.user.tenantId, id, {
      name: body.name,
      code: body.code,
      branch: body.branch,
      location: body.location,
      procurementYear: Number(body.procurementYear),
      category: body.category,
    });
  }

  // ================= DELETE =================
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.service.delete(req.user.tenantId, id);
  }


   @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header(
    'Content-Disposition',
    'attachment; filename=assets.csv',
  )
  async exportCsv(@Req() req: any): Promise<StreamableFile> {
    const csv = await this.service.exportCsv(
      req.user.tenantId,
    );

    return new StreamableFile(Buffer.from(csv));
  }








  // ================= IMPORT CSV =================
@Post('import/csv')
@UseInterceptors(FileInterceptor('file'))
async importCsv(
  @Req() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('CSV file is required');
  }

  if (!file.originalname.endsWith('.csv')) {
    throw new BadRequestException('Only CSV file is allowed');
  }

  // ✅ KIRIM BUFFER
  return this.service.importCsv(
    req.user.tenantId,
    file.buffer,
  );
}

}
