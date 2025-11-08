const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Error: Email required');
    console.log('\nUsage:');
    console.log('  node scripts/make-admin.js <email>');
    console.log('\nExample:');
    console.log('  node scripts/make-admin.js admin@example.com');
    process.exit(1);
  }

  try {
    console.log(`\n🔍 Looking for user: ${email}...`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!existingUser) {
      console.error(`\n❌ User not found: ${email}`);
      console.log('\nMake sure the user has registered an account first.');
      process.exit(1);
    }

    if (existingUser.role === 'admin') {
      console.log(`\n✅ User ${email} is already an admin!`);
      process.exit(0);
    }

    // Update role to admin
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
      select: { id: true, email: true, name: true, role: true },
    });

    console.log('\n✅ Success! User is now an admin:');
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log('\nThe user can now access the admin dashboard at:');
    console.log('   http://localhost:3000/admin\n');
  } catch (error) {
    console.error('\n❌ Error updating user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
