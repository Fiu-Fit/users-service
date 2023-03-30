import { PrismaClient } from '@prisma/client';
import { UserRoles } from '../src/modules/user/user.dto';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.user.createMany({
      data: [
        {
          firstName: 'Ian',
          lastName:  'Shih',
          email:     'ishih@fi.uba.ar',
          password:
            '$2b$10$wXMtruMCWd2g3AXOrhG91uhDKFxpEo6rWj.n0C8r/HrvHq5WDGWea',
          role: UserRoles.Admin
        },
        {
          firstName: 'Manuel',
          lastName:  'Sanchez Fernandez de la Vega',
          email:     'msanchezf@fi.uba.ar',
          password:
            '$2b$10$wXMtruMCWd2g3AXOrhG91uhDKFxpEo6rWj.n0C8r/HrvHq5WDGWea',
          role: UserRoles.Athlete
        },
        {
          firstName: 'Rocio',
          lastName:  'Platini',
          email:     'rplatinif@fi.uba.ar',
          password:
            '$2b$10$wXMtruMCWd2g3AXOrhG91uhDKFxpEo6rWj.n0C8r/HrvHq5WDGWea',
          role: UserRoles.Trainer
        }
      ]
    })
  ]);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .then(() => {
        console.log('Disconnected from db');
      })
      .catch(console.error);
  });
