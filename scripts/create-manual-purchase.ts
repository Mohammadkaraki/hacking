import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Creating manual purchase for testing...\n');

  // Get the first user
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!user) {
    console.log('❌ No user found!');
    return;
  }

  console.log(`✅ Found user: ${user.name} (${user.email})\n`);

  // Get the first course
  const course = await prisma.course.findFirst();

  if (!course) {
    console.log('❌ No courses found!');
    return;
  }

  console.log(`✅ Found course: ${course.title} - $${course.price}\n`);

  // Check if purchase already exists
  const existing = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (existing) {
    console.log('⚠️  Purchase already exists!');
    console.log(`   Purchase ID: ${existing.id}`);
    console.log(`   Status: ${existing.status}`);
    return;
  }

  // Create purchase
  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      courseId: course.id,
      stripePaymentIntentId: 'pi_manual_test_' + Date.now(),
      stripeSessionId: 'cs_test_a1ti8RPdRXCDSZ1xd5nodNhH5sdEEQbnOeavYbWtIrhQitEcJgeVvNG0Hi',
      amount: course.price,
      currency: 'USD',
      status: 'completed',
    },
  });

  console.log('✅ Purchase created successfully!\n');
  console.log(`   Purchase ID: ${purchase.id}`);
  console.log(`   User: ${user.email}`);
  console.log(`   Course: ${course.title}`);
  console.log(`   Amount: $${purchase.amount}`);
  console.log(`   Status: ${purchase.status}`);
  console.log('\n🎉 Refresh your dashboard to see the course!');

  await prisma.$disconnect();
}

main().catch(console.error);
