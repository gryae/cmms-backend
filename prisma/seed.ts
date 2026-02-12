import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo tenant & admin...');

  // 1️⃣ CREATE TENANT
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo CMMS Tenant',
    },
  });

  // 2️⃣ HASH PASSWORD
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 3️⃣ CREATE ADMIN USER
  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'gerryfhb@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
      name: 'Gerry',
    },
  });

  console.log('✅ SEED SUCCESS');
  console.log({
    tenantId: tenant.id,
    adminEmail: admin.email,
    password: '123456',
  });
}

main()
  .catch((e) => {
    console.error('❌ SEED FAILED', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
