/**
 * Manual cleanup script
 * Run this script manually with: npx ts-node scripts/cleanup.ts
 * Or add it to package.json scripts
 */

import { runCleanupTasks } from '../lib/cleanup';

async function main() {
  console.log('Starting cleanup tasks...\n');

  const results = await runCleanupTasks();

  console.log('\n=== Cleanup Results ===');
  console.log('Unverified Accounts:', results.unverifiedAccounts);
  console.log('Expired Tokens:', results.expiredTokens);
  console.log('=======================\n');

  process.exit(0);
}

main().catch((error) => {
  console.error('Cleanup script failed:', error);
  process.exit(1);
});
