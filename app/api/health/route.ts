import { NextResponse } from 'next/server'
import { ping } from '@/lib/health/repository'

export async function GET() {
  try {
    const dbTime = await ping()
    return NextResponse.json({ ok: true, db_time: dbTime })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
