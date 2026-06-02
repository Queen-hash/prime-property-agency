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
    const body = await request.json();
    const { email, password } = body;

    // Ambil IP untuk tracking
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // 1. CEK SISTEM LOCKOUT (Gagal 5x dalam 30 menit)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    // Pakai supabaseAdmin untuk cek history kegagalan (Nembus RLS)
    const { count, error: countError } = await supabaseAdmin
      .from('login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('attempt_time', thirtyMinsAgo);

    if (count !== null && count >= 5) {
      // Cek apakah sudah lewat 15 menit dari percobaan terakhir
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: lastAttempt } = await supabaseAdmin
        .from('login_attempts')
        .select('attempt_time')
        .eq('email', email)
        .order('attempt_time', { ascending: false })
        .limit(1)
        .single();

      if (lastAttempt && new Date(lastAttempt.attempt_time) > new Date(fifteenMinsAgo)) {
        return NextResponse.json(
          { error: 'Akun dikunci sementara. Coba lagi dalam 15 menit.' },
          { status: 429 }
        );
      }
    }

    // 2. VERIFIKASI KE SUPABASE (Nembus RLS tabel profiles)
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles') 
      .select('id, email, role, password')
      .eq('email', email)
      .single();

    console.log("Error dari Supabase:", userError);
    console.log("Data User dari Supabase:", user);

    if (!user || user.password !== password) {
      // Catat kegagalan login pakai supabaseAdmin
      await supabaseAdmin.from('login_attempts').insert([{ email, ip_address: ip }]);
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    // 3. JIKA SUKSES: Hapus history kegagalan biar bersih lagi pakai supabaseAdmin
    await supabaseAdmin.from('login_attempts').delete().eq('email', email);

    // 4. SET SESSION KE HTTP-ONLY COOKIE (Berlaku 30 Hari)
    const sessionData = JSON.stringify({ id: user.id, email: user.email, role: user.role });
    const encodedSession = Buffer.from(sessionData).toString('base64'); // Mocking token

    (await cookies()).set({
      name: 'agent_session',
      value: encodedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 Hari
    });

    return NextResponse.json({ success: true, role: user.role }, { status: 200 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}