import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Liveness/readiness probe. Returns no internal details.
export async function GET() {
  try {
    await connectToDatabase();
    const ready = mongoose.connection.readyState === 1;
    return NextResponse.json({ status: ready ? 'ok' : 'degraded' }, { status: ready ? 200 : 503 });
  } catch {
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }
}
