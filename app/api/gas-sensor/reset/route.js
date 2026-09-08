import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function DELETE() {
  try {
    // Hapus hash key 'devices'
    await redis.del('devices');
    return NextResponse.json({ success: true, message: 'Database cleared successfully!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}