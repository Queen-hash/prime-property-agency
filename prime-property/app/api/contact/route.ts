import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 1. Tambahkan import ini

// 2. Bikin klien khusus Backend pakai Kunci Master (Service Role Key)
// Klien ini kebal dari aturan RLS yang digembok
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Ambil IP Address pengirim dari headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // 2. Cek Rate Limit: Hitung berapa kali IP ini ngirim dalam 1 jam terakhir
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // Pakai supabaseAdmin biar bisa baca tabel contact_submissions yang digembok
    const { count, error: countError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo);

    if (countError) throw countError;

    // Jika sudah 3 kali atau lebih, tolak mentah-mentah!
    if (count !== null && count >= 3) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 jam.' },
        { status: 429 }
      );
    }

    // 3. Kalau aman, ambil data dari frontend dan simpan ke database
    const body = await request.json();
    const { nama, email, noHp, pesan } = body;

    // Pakai supabaseAdmin biar bisa nyimpen (INSERT) ke tabel contact_submissions
    const { error: insertError } = await supabaseAdmin
      .from('contact_submissions')
      .insert([
        {
          nama: nama,
          email: email,
          noHp: noHp,
          pesan: pesan,
          ip_address: ip
        }
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}