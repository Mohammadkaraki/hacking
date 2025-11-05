import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Checking purchases in database...\n');

  const purchases = await prisma.purchase.findMany({
    orderBy: { purchaseDate: 'desc' },
    take: 10,
    include: {
      course: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (purchases.length === 0) {
    console.log('❌ No purchases found in database!');
    console.log('\nThis means the Stripe webhook did not process the payment.');
    console.log('The webhook endpoint is: /api/payments/webhook');
  } else {
    console.log(`✅ Found ${purchases.length} purchase(s):\n`);
    purchases.forEach((purchase, index) => {
      console.log(`${index + 1}. Purchase ID: ${purchase.id}`);
      console.log(`   User: ${purchase.user.name} (${purchase.user.email})`);
      console.log(`   Course: ${purchase.course.title}`);
      console.log(`   Amount: $${purchase.amount}`);
      console.log(`   Status: ${purchase.status}`);
      console.log(`   Session ID: ${purchase.stripeSessionId || 'N/A'}`);
      console.log(`   Date: ${purchase.purchaseDate}`);
      console.log('');
    });
  }

  await prisma.$disconnect();
}

main().catch(console.error);
