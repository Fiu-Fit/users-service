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
            '$2b$10$RE5erES6xyuBiI92pxrAhuaSvmygFBJ3zNEtH9ylLrLyqhOSW36Cq',
          role: UserRoles.Admin
        },
        {
          firstName: 'Manuel',
          lastName:  'Sanchez Fernandez de la Vega',
          email:     'msanchezf@fi.uba.ar',
          password:
            '$2b$10$RE5erES6xyuBiI92pxrAhuaSvmygFBJ3zNEtH9ylLrLyqhOSW36Cq',
          role: UserRoles.Athlete
        },
        {
          firstName: 'Rocio',
          lastName:  'Platini',
          email:     'rplatinif@fi.uba.ar',
          password:
            '$2b$10$RE5erES6xyuBiI92pxrAhuaSvmygFBJ3zNEtH9ylLrLyqhOSW36Cq',
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
