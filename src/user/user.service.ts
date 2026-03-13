import {
  ForbiddenException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    tenantId: string,
    email: string,
    password: string,
    role: Role,
    name: string,
    phoneNumber: string,
  ) {
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new BadRequestException('Email already used');
    }

    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        tenantId,
        email,
        password: hashed,
        role,
        name,
        phoneNumber,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        name:true,
        phoneNumber:true,
      },
    });
  }

   async updateRole(
    tenantId: string,
    userId: string,
    role: Role,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new ForbiddenException();
    }

    if (user.email === process.env.SUPER_ADMIN_EMAIL) {
      throw new ForbiddenException(
        'Super Admin role cannot be changed',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }


  async deleteUser(tenantId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new ForbiddenException();
    }

    if (user.email === process.env.SUPER_ADMIN_EMAIL) {
      throw new ForbiddenException(
        'Super Admin cannot be deleted',
      );
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateUser(
  tenantId: string,
  userId: string,
  email: string,
  name: string,
  role: Role,
  password?: string,
  phoneNumber?: string,
) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.tenantId !== tenantId) {
    throw new ForbiddenException();
  }

  if (user.email === process.env.SUPER_ADMIN_EMAIL && role !== 'ADMIN') {
    throw new ForbiddenException('Super Admin role cannot be changed');
  }

  // cek email kalau berubah
  if (email !== user.email) {
    const emailUsed = await this.prisma.user.findUnique({
      where: { email },
    });
    if (emailUsed) {
      throw new BadRequestException('Email already used');
    }
  }

  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      email,
      phoneNumber,
      name,
      role,
      ...(hashedPassword && { password: hashedPassword }),
    },
  });
}
}
