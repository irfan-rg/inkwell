/**
 * Keep-Alive API Route
 * 
 * This endpoint can be pinged by external cron services (like cron-job.org, UptimeRobot, etc.)
 * to keep the Supabase database from sleeping on free tier
 * 
 * Usage:
 * - Set up a cron job to ping: https://your-domain.vercel.app/api/keep-alive
 * - Recommended frequency: Every 5-10 minutes
 */

import { NextResponse } from 'next/server';
import { checkDatabaseStatus } from '@/lib/supabase/keep-alive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const status = await checkDatabaseStatus();
    
    if (!status.isAlive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database is not responsive',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database is alive',
      responseTime: `${status.responseTime}ms`,
      isColdStart: status.isColdStart,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Keep-alive check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
