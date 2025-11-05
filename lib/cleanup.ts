import prisma from '@/lib/prisma';

/**
 * Delete unverified user accounts that are older than 7 days
 * This helps keep the database clean and prevents abandoned accounts
 */
export async function deleteUnverifiedAccounts() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await prisma.user.deleteMany({
      where: {
        emailVerified: null,
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(`Deleted ${result.count} unverified accounts older than 7 days`);
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Failed to delete unverified accounts:', error);
    return { success: false, error };
  }
}

/**
 * Delete expired verification tokens
 * Keeps the VerificationToken table clean
 */
export async function deleteExpiredTokens() {
  try {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    console.log(`Deleted ${result.count} expired verification tokens`);
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Failed to delete expired tokens:', error);
    return { success: false, error };
  }
}

/**
 * Run all cleanup tasks
 */
export async function runCleanupTasks() {
  console.log('Running cleanup tasks...');

  const accountsResult = await deleteUnverifiedAccounts();
  const tokensResult = await deleteExpiredTokens();

  return {
    unverifiedAccounts: accountsResult,
    expiredTokens: tokensResult,
  };
}
