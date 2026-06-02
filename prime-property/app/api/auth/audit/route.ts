import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // 1. Cek tiket (cookie) Superadmin
    const sessionCookie = (await cookies()).get('agent_session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
    if (decoded.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Tarik data log pakai Kunci Master (Nembus RLS)
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Ambil 50 log terbaru biar ga berat

    if (error) throw error;

    return NextResponse.json({ data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}