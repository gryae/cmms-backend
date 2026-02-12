import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN','SUPERVISOR','USER') // 🔒 DEFAULT: ADMIN ONLY
export class UserController {
  constructor(private service: UserService) {}

  // ================= CREATE USER =================
  @Post()
  create(
    @Req() req: any,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: Role,
    @Body('name') name: string,
  ) {
    return this.service.createUser(
      req.user.tenantId,
      email,
      password,
      role,
      name,
    );
  }

  // ================= LIST USERS =================
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.tenantId);
  }

  // ================= UPDATE ROLE =================
  @Patch(':id/role')
  updateRole(
    @Req() req: any,
    @Param('id') id: string,
    @Body('role') role: Role,
  ) {
    return this.service.updateRole(
      req.user.tenantId,
      id,
      role,
    );
  }

  // ================= DELETE USER =================
  @Delete(':id')
  deleteUser(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.deleteUser(
      req.user.tenantId,
      id,
    );
  }
}
