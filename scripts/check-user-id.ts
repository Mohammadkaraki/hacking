import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Checking users and their purchases...\n');

  const users = await prisma.user.findMany({
    include: {
      purchases: {
        include: {
          course: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  users.forEach((user) => {
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`User ID: ${user.id}`);
    console.log(`Purchases: ${user.purchases.length}`);
    if (user.purchases.length > 0) {
      user.purchases.forEach((purchase, idx) => {
        console.log(`  ${idx + 1}. ${purchase.course.title} - $${purchase.amount}`);
      });
    }
    console.log('');
  });

  await prisma.$disconnect();
}

main().catch(console.error);
