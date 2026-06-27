import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      service: 'creative-network',
      database: 'reachable',
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: 'creative-network',
        database: 'unreachable',
        latencyMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
