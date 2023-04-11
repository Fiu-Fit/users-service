import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.user.createMany({
      data: [
        {
          uid:       '1',
          firstName: 'Ian',
          lastName:  'Shih',
          email:     'ishih@fi.uba.ar',
          role:      Role.Admin,
        },
        {
          uid:       '2',
          firstName: 'Manuel',
          lastName:  'Sanchez Fernandez de la Vega',
          email:     'msanchezf@fi.uba.ar',
          role:      Role.Athlete,
        },
        {
          uid:       '3',
          firstName: 'Rocio',
          lastName:  'Platini',
          email:     'rplatinif@fi.uba.ar',
          role:      Role.Trainer,
        },
      ],
    }),
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
