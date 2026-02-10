import { NextResponse } from 'next/server';
import payload from 'payload';

export async function GET() {
  try {
    // Basic server info
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'unknown',
    };

    // Check database connection via Payload
    try {
      // Basic check if payload is initialized
      if (payload.db) {
        healthCheck.database = 'connected';
      } else {
        healthCheck.database = 'disconnected';
      }
    } catch (dbError) {
      healthCheck.database = 'error';
      console.error('Database health check failed:', dbError);
    }

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
