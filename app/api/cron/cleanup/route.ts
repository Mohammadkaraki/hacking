import { NextRequest, NextResponse } from 'next/server';
import { runCleanupTasks } from '@/lib/cleanup';

/**
 * API endpoint for running cleanup tasks
 * This can be called by a cron job service (e.g., Vercel Cron, GitHub Actions, or external cron service)
 *
 * To secure this endpoint, you can:
 * 1. Add authentication header check
 * 2. Use Vercel Cron Jobs (automatically authenticated)
 * 3. Set up IP whitelist
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Check for authorization header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run cleanup tasks
    const results = await runCleanupTasks();

    return NextResponse.json({
      message: 'Cleanup tasks completed',
      results,
    }, { status: 200 });
  } catch (error) {
    console.error('Cleanup cron job error:', error);
    return NextResponse.json({ error: 'Failed to run cleanup tasks' }, { status: 500 });
  }
}
