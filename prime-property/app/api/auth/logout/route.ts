import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Menghapus cookie agent_session dari sisi server
  (await cookies()).delete('agent_session');
  
  return NextResponse.json({ success: true, message: 'Logout berhasil' });
}