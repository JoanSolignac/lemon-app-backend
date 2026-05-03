import dotenv from 'dotenv';

dotenv.config({
  path: '.env.dev',
});

import * as argon2 from 'argon2';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { Pool } from 'pg';

import { Rol } from '../src/common/types/user-role.enum';

const databaseUrl =
  process.env.DATABASE_URL!;

const pool =
  new Pool({
    connectionString:
      databaseUrl,
  });

const adapter =
  new PrismaPg(pool);

const prisma =
  new PrismaClient({
    adapter,
  });

async function main():
  Promise<void> {

  await prisma.usuario.upsert({

    where: {
      correoElectronico:
        'admin@limones.com',
    },

    update: {},

    create: {

      nombre:
        'ADMINISTRADOR',

      correoElectronico:
        'admin@limones.com',

      contrasena:
        await argon2.hash(
          '1234567890',
        ),

      rol:
        Rol.ADMINISTRADOR,

    },

  });

  console.log(
    'Administrador creado.',
  );
}

main()
  .catch(console.error)
  .finally(async () => {

    await prisma.$disconnect();
    await pool.end();

  });