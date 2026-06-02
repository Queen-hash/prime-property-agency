import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js'; // 1. Tambahkan import ini

// 2. Bikin klien khusus Backend pakai Kunci Master (Service Role Key)
// Klien ini kebal dari aturan RLS yang digembok
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Ambil tiket dari cookie
    const sessionCookie = (await cookies()).get('agent_session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Buka isi tiketnya buat ngecek Role
    const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
    
    // 3. ATURAN BISNIS LOGIN: Tolak mutasi dengan 403 Forbidden jika bukan Superadmin!
    if (decoded.role !== 'superadmin') {
      return NextResponse.json({ 
        error: '403 Forbidden: Akses ditolak. Hanya Superadmin yang dapat mengubah data.' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { action, payload, id, property_name } = body;

    let error;
    
    // 4. Eksekusi Perintah menggunakan supabaseAdmin (Nembus RLS)
    if (action === 'INSERT') {
      const res = await supabaseAdmin.from('properties').insert([payload]);
      error = res.error;
    } else if (action === 'UPDATE') {
      const res = await supabaseAdmin.from('properties').update(payload).eq('id', id);
      error = res.error;
    } else if (action === 'DELETE') {
      const res = await supabaseAdmin.from('properties').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      error = res.error;
    }

    if (error) throw error;

    // 5. HISTORY AUDIT: Catat otomatis siapa yang ngedit ke database pakai supabaseAdmin
    await supabaseAdmin.from('audit_logs').insert([{
        user_email: decoded.email,
        action: action,
        property_name: property_name || payload?.nama_property || 'Properti',
        details: `Melakukan ${action} data properti pada sistem.`
    }]);

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Properties API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}