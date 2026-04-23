import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await query<{ now: string }>('SELECT NOW() as now')
    return NextResponse.json({ ok: true, db_time: result.rows[0].now })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
