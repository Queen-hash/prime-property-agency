"use client";

import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A1A]">
      
      {/* HEADER */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <img src="/logo.png" alt="Logo Prime Property" className="h-17 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#1A1A1A]">
            <Link href="/" className="hover:text-[#C9A961] transition-colors">Beranda</Link>
            <Link href="/about" className="text-[#C9A961] transition-colors">Tentang Kami</Link>
            <Link href="/contact" className="hover:text-[#C9A961] transition-colors">Kontak</Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION ABOUT (Lebih Elegan) */}
      <section className="bg-[#1A1A1A] pt-32 pb-24 px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Mendefinisikan Ulang <span className="text-[#C9A961] italic font-serif">Kemewahan</span>.
            </h1>
          </div>
          <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed pb-2">
            Kami hadir untuk menghubungkan Anda dengan karya arsitektur terbaik dan peluang investasi bernilai tinggi.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA - GAYA EDITORIAL (AC-3.1) */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 mb-32">
          
          <div className="md:w-1/3">
            <div className="sticky top-32">
              <div className="text-[#C9A961] font-bold tracking-[0.2em] text-xs mb-4 uppercase">Kisah Kami</div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] leading-tight mb-6">Integritas dalam Setiap Transaksi.</h2>
              <div className="h-1 w-12 bg-[#C9A961]"></div>
            </div>
          </div>
          
          <div className="md:w-2/3 prose prose-lg text-gray-600">
            <p className="mb-6 leading-relaxed">
              Prime Property bukan sekadar agen real estate. Kami adalah firma kurator properti eksklusif yang berfokus pada kualitas, detail, dan potensi pertumbuhan nilai aset di masa depan. 
            </p>
            <p className="mb-10 leading-relaxed">
              Berangkat dari pemahaman bahwa properti adalah keputusan finansial dan personal terbesar, tim spesialis kami mendedikasikan diri untuk memberikan transparansi total. Kami menyeleksi setiap listing dengan ketat, memastikan hanya proyek dengan legalitas jelas, spesifikasi bangunan premium, dan lokasi strategis yang sampai ke tangan Anda.
            </p>
            
            <blockquote className="pl-6 border-l-2 border-[#C9A961] italic text-xl text-[#1A1A1A] font-medium my-12">
              "Fokus kami bukanlah menutup penjualan sebanyak-banyaknya, melainkan membangun relasi seumur hidup melalui kepercayaan dan hasil nyata."
              <footer className="text-sm font-bold text-[#C9A961] mt-4 not-italic uppercase tracking-widest">— Manajemen Prime Property</footer>
            </blockquote>
          </div>
          
        </div>

        {/* VISI, MISI, NILAI (Tanpa Kotak Kaku & Tanpa Emoji) */}
        <div className="border-t border-gray-200 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            <div className="group">
              <div className="mb-6 text-[#1A1A1A] group-hover:text-[#C9A961] transition-colors">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Visi</h3>
              <p className="text-gray-600 leading-relaxed">Menjadi standar acuan dalam industri real estate eksklusif di Asia Tenggara dengan mengedepankan inovasi, profesionalisme, dan kurasi portofolio yang tak tertandingi.</p>
            </div>

            <div className="group">
              <div className="mb-6 text-[#1A1A1A] group-hover:text-[#C9A961] transition-colors">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Misi</h3>
              <p className="text-gray-600 leading-relaxed">Menyederhanakan proses kepemilikan properti premium melalui layanan konsultasi yang komprehensif, transparan, dan disesuaikan dengan profil investasi setiap klien.</p>
            </div>

            <div className="group">
              <div className="mb-6 text-[#1A1A1A] group-hover:text-[#C9A961] transition-colors">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Nilai Inti</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start gap-3"><span className="text-[#C9A961]">✦</span> Integritas tanpa kompromi.</li>
                <li className="flex items-start gap-3"><span className="text-[#C9A961]">✦</span> Transparansi data pasar.</li>
                <li className="flex items-start gap-3"><span className="text-[#C9A961]">✦</span> Kepuasan jangka panjang klien.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-4 border-[#C9A961] mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-6 bg-white p-2 rounded shadow-sm w-fit">
              <img src="/logo.png" alt="Logo Prime Property" className="h-17 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Membangun kepercayaan melalui integritas dan kurasi properti eksklusif di Asia Tenggara.
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-[#C9A961] font-bold mb-6 uppercase tracking-widest text-xs">Hubungi Kami</h4>
            <div className="text-gray-300 text-sm space-y-4">
              <p className="flex items-center gap-3"><span className="text-[#C9A961]">Telp:</span> +62 21 1234 5678</p>
              <p className="flex items-center gap-3"><span className="text-[#C9A961]">WA:</span> +62 812 3456 7890</p>
              <p className="flex items-center gap-3"><span className="text-[#C9A961]">Email:</span> consultation@primeproperty.id</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-[#C9A961] font-bold mb-6 uppercase tracking-widest text-xs">Tautan Penting</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><span className="text-[#C9A961] text-xs">→</span> Tentang Kami</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><span className="text-[#C9A961] text-xs">→</span> Hubungi Kami</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2026 Prime Property. All rights reserved.
        </div>
      </footer>
    </div>
  );
}