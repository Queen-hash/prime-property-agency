import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store untuk simulasi tracking IP (Rate Limiting)
const ipRequests = new Map<string, number[]>();

export function proxy(request: NextRequest) {
  // ==========================================
  // 1. LOGIKA RATE LIMITING (ANTI-SPAM)
  // ==========================================
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || '127.0.0.1');
  const now = Date.now();
  const windowMs = 60 * 1000; // Jendela waktu: 1 menit

  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, []);
  }

  const timestamps = ipRequests.get(ip) ?? [];
  // Bersihkan data request yang lebih dari 1 menit yang lalu
  const recentRequests = timestamps.filter((time: number) => now - time < windowMs);
  recentRequests.push(now);
  ipRequests.set(ip, recentRequests);

  const isAuthEndpoint = request.nextUrl.pathname.includes('/agent/login') || request.nextUrl.pathname.startsWith('/auth');

  // AC-9.2: Rule Endpoint Auth (Maksimal 10 request / menit)
  if (isAuthEndpoint) {
    if (recentRequests.length > 10) {
      return new NextResponse(
        JSON.stringify({ error: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } 
  // AC-9.2: Rule Global (Maksimal 100 request / menit)
  else {
    if (recentRequests.length > 100) {
      return new NextResponse(
        JSON.stringify({ error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ==========================================
  // 2. LOGIKA SATPAM HALAMAN (SESSION COOKIE)
  // ==========================================
  const sessionCookie = request.cookies.get('agent_session');
  const isAccessingDashboard = request.nextUrl.pathname.startsWith('/agent/dashboard');
  const isAccessingLogin = request.nextUrl.pathname.startsWith('/agent/login');

  // A. Jika mau akses dashboard TAPI gak punya tiket -> Tendang ke login
  if (isAccessingDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL('/agent/login', request.url));
  }

  // B. Jika udah punya tiket TAPI iseng buka halaman login -> Paksa masuk ke dashboard
  if (isAccessingLogin && sessionCookie) {
    return NextResponse.redirect(new URL('/agent/dashboard', request.url));
  }

  // Jika aman, silakan lewat!
  return NextResponse.next();
}

// Config ini ngasih tau middleware area mana aja yang harus dijaga ketat
export const config = {
  matcher: [
    '/agent/dashboard/:path*', 
    '/agent/login',
    '/api/:path*'
  ],
};