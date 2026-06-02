"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase"; 
import { motion } from "framer-motion"; // <-- TAMBAHAN IMPORT FRAMER MOTION

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(6);
        
      if (data) setProperties(data);
      setIsLoading(false);
    };

    fetchLatestProperties();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const testimonials = [
    { initial: "R", name: "Rudi Hermawan", role: "Pembeli Ruko Pancing", text: "Investasi terbaik tahun ini. Unit ruko saya sudah tersewa bahkan sebelum serah terima kunci selesai. Luar biasa!", stars: 5 },
    { initial: "A", name: "Anita Putri", role: "Pengusaha", text: "Sangat terbantu dengan konsultasi KPR-nya. Tim agen sangat sabar menjelaskan detail skema pembayaran hingga deal.", stars: 4 },
    { initial: "H", name: "Hendra Wijaya", role: "Pembeli Sinar Residence", text: "Desain rumahnya modern dan fungsional. Lingkungannya asri dan keamanannya terjaga. Terima kasih Prime Property!", stars: 5 },
    { initial: "B", name: "Budi Santoso", role: "Investor Properti", text: "Proses administrasi sangat transparan. Tidak ada biaya tersembunyi dan legalitas diurus dengan sangat profesional.", stars: 5 },
    { initial: "S", name: "Siska Saraswati", role: "Pembeli Villa Sakura", text: "Mendapatkan hunian impian dengan harga yang sangat masuk akal. Tim Prime Property benar-benar mengerti kebutuhan saya.", stars: 5 },
  ];

  // ==========================================
  // VARIANTS ANIMASI FRAMER MOTION
  // ==========================================
  
  // Animasi dasar: Muncul dari bawah
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  // Wadah Stagger (Buat nampung efek antre bergiliran)
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // Jeda antar card (0.15 detik)
      }
    }
  };

  // Item Stagger (Dipakai barengan sama staggerContainer)
  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 80, damping: 15 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#1A1A1A]">
      
      {/* CSS KHUSUS UNTUK ANIMASI SLIDER TESTIMONI */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-slider {
          display: flex;
          width: 200%;
          animation: slide 20s linear infinite;
        }
        .animate-slider:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* HEADER */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <img src="/logo.png" alt="Logo Prime Property" className="h-17 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#1A1A1A]">
            <Link href="/" className="text-[#C9A961] transition-colors">Beranda</Link>
            <Link href="/about" className="hover:text-[#C9A961] transition-colors">Tentang Kami</Link>
            <Link href="/contact" className="hover:text-[#C9A961] transition-colors">Kontak</Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#1A1A1A] pt-32 pb-24 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
        
        {/* ANIMASI MASUK HERO */}
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl drop-shadow-lg">
            Mendefinisikan Ulang <span className="text-[#C9A961] italic font-serif">Kemewahan</span> Real Estate.
          </h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-10 drop-shadow-md">
            Eksplorasi mahakarya arsitektur terbaik dan peluang investasi bernilai tinggi di lokasi paling prestisius.
          </p>
          <Link href="#listings" className="bg-[#C9A961] text-[#1A1A1A] font-bold px-8 py-3.5 rounded-full hover:bg-white hover:scale-105 shadow-lg transition-all">
            Lihat Properti
          </Link>
        </motion.div>
      </section>

      {/* VALUE PROPOSITION SECTION */}
      <section className="py-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          
          {/* ANIMASI STAGGER VALUE PROPOSITION (Scroll Reveal) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            {/* Kiri: Teks & Ikon */}
            <motion.div variants={cardVariant} className="w-full lg:w-1/2">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px bg-[#C9A961] w-8"></div>
                <span className="text-[10px] font-bold text-[#C9A961] uppercase tracking-widest">Keunggulan Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 leading-tight">Mengapa Memilih<br/>Prime Property?</h2>
              
              <div className="space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 shrink-0 bg-yellow-50 rounded-xl flex items-center justify-center text-[#C9A961] shadow-inner">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Properti Terverifikasi</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Setiap properti telah melalui proses verifikasi dokumen yang ketat dan legal.</p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 shrink-0 bg-yellow-50 rounded-xl flex items-center justify-center text-[#C9A961] shadow-inner">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Nilai Investasi Tinggi</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Lokasi strategis di kawasan prestisius dengan potensi kenaikan nilai yang konsisten.</p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 shrink-0 bg-yellow-50 rounded-xl flex items-center justify-center text-[#C9A961] shadow-inner">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Layanan End-to-End</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Dari konsultasi, survei, negosiasi, hingga serah terima — kami dampingi setiap langkah.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Kanan: Gambar Asli Rumah */}
            <motion.div variants={cardVariant} className="w-full lg:w-1/2 relative mt-10 lg:mt-0">
              
              {/* 1. WADAH UTAMA: overflow-hidden DIHAPUS biar badge bisa keluar */}
              <div className="aspect-4/3 rounded-2xl relative shadow-2xl group">
                
                {/* 2. WADAH GAMBAR: Kita kasih overflow-hidden KHUSUS buat gambarnya aja biar zoom-nya gak meluber */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Rumah Mewah Prime Property" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                </div>
                
                {/* 3. FLOATING BADGE: Sekarang aman bisa "keluar" bebas ke kanan atas */}
                <div className="absolute -top-4 -right-4 md:top-8 md:-right-6 bg-[#C9A961] w-28 h-28 md:w-32 md:h-32 rounded-3xl flex flex-col items-center justify-center text-[#1A1A1A] shadow-xl rotate-3 z-10 border-4 border-white">
                  <span className="text-3xl font-black">10+</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight mt-1">Properti<br/>Tersedia</span>
                </div>

                {/* 4. FLOATING REVIEW: Sekarang aman bisa "keluar" ke kiri bawah */}
                <div className="absolute bottom-4 left-4 md:bottom-8 md:-left-6 bg-white p-5 rounded-2xl shadow-2xl max-w-60 z-10 border border-gray-100">
                  <div className="flex gap-1 text-[#C9A961] mb-2 text-sm">★ ★ ★ ★ ★</div>
                  <p className="text-[#1A1A1A] font-bold text-sm leading-snug italic">"Pelayanan sangat profesional dan responsif!"</p>
                  <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-wide">— Klien Puas, Bali</p>
                </div>

              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* SECTION LISTING PROPERTI */}
      <section id="listings" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[10px] font-bold text-[#C9A961] uppercase tracking-widest">Koleksi Kami</span>
              <div className="h-px bg-[#C9A961] w-12"></div>
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Properti Pilihan</h2>
          </div>
          <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#C9A961] bg-white px-6 py-2.5 rounded-full border border-gray-200 hover:border-[#C9A961] shadow-sm transition-all">
            Lihat Semua <span>→</span>
          </Link>
        </motion.div>

        {/* GRID PROPERTI DENGAN ANIMASI STAGGER */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A961] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Memuat properti premium...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-20 text-center text-gray-400">Belum ada listing properti yang tersedia.</div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.map((prop) => (
              <motion.div 
                variants={cardVariant}
                key={prop.id} 
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C9A961]/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* AREA GAMBAR */}
                <div className="h-56 relative overflow-hidden group">
                  <img 
                    src={prop.tipe === 'Villa' 
                      ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop' 
                      : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop'} 
                    alt={prop.nama_property}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-0"></div>
                  
                  {/* Badge Tipe */}
                  <div className="absolute top-4 left-4 bg-white text-[#1A1A1A] px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
                    {prop.tipe}
                  </div>
                  
                  {/* Badge Status */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1.5 text-[10px] rounded-md font-bold uppercase tracking-wider shadow-sm ${prop.status === 'in_stock' ? 'bg-[#C9A961] text-white' : 'bg-[#B33A3A] text-white'}`}>
                      {prop.status === 'in_stock' ? 'Tersedia' : 'Terjual'}
                    </span>
                  </div>

                  {/* Harga */}
                  <div className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-md z-10">
                    {formatRupiah(prop.price)}
                  </div>
                </div>

                {/* DETAIL KONTEN & SVG ICONS */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold text-[#C9A961] uppercase tracking-widest mb-1">{prop.group || "Premium Estate"}</div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#C9A961] transition-colors line-clamp-1">{prop.nama_property}</h3>
                  <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {prop.kawasan}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500 font-medium py-4 border-t border-gray-100/80">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5" title="Dimensi">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        {prop.lebar}x{prop.panjang}m
                      </span>
                      <span className="flex items-center gap-1.5" title="Lantai">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        {prop.tingkat} Lt
                      </span>
                      {prop.carport && (
                        <span className="flex items-center gap-1.5" title="Carport">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12.5a2.5 2.5 0 012.5 2.5V15h-3m-6 0h-4m-4 0H2v-2.5a2.5 2.5 0 012.5-2.5h1.5M10 15a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                        </span>
                      )}
                    </div>
                    <span className="text-[#C9A961] capitalize font-bold tracking-wide text-[10px]">
                      {prop.siap.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* TESTIMONIAL SECTION */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-24 bg-white border-y border-gray-100 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px bg-[#C9A961] w-8"></div>
              <span className="text-[10px] font-bold text-[#C9A961] uppercase tracking-widest">Suara Pelanggan</span>
              <div className="h-px bg-[#C9A961] w-8"></div>
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Apa Kata Mereka?</h2>
          </div>
        </div>

        <div className="relative w-full max-w-[100vw] overflow-hidden">
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <div className="animate-slider gap-6 py-4 px-4 cursor-grab active:cursor-grabbing">
            {[...testimonials, ...testimonials].map((testi, index) => (
              <div key={index} className="w-75 md:w-87.5 shrink-0 bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative hover:border-[#C9A961]/30 transition-colors">
                <div className="absolute top-6 right-6 text-gray-100 opacity-60">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
                </div>
                <div className="flex gap-1 text-[#C9A961] text-sm mb-6 z-10">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < testi.stars ? "text-[#C9A961]" : "text-gray-200"}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic flex-1 mb-8 z-10 relative">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#C9A961] font-bold flex items-center justify-center text-sm shadow-sm">
                    {testi.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{testi.name}</h4>
                    <p className="text-[10px] text-[#C9A961] uppercase tracking-wider">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-4 border-[#C9A961]">
        <motion.div 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }} 
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12"
        >
          
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
              <p className="flex items-center gap-3">
                <span className="text-[#C9A961]">Telp:</span> +62 21 1234 5678
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[#C9A961]">WA:</span> 
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors border-b border-gray-600 hover:border-white pb-0.5">
                  +62 812 3456 7890
                </a>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[#C9A961]">Email:</span> consultation@primeproperty.id
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-[#C9A961] font-bold mb-6 uppercase tracking-widest text-xs">Tautan Penting</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                <span className="text-[#C9A961] text-xs">→</span> Tentang Kami
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                <span className="text-[#C9A961] text-xs">→</span> Hubungi Kami
              </Link>
            </div>
          </div>

        </motion.div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2026 Prime Property. All rights reserved.
        </div>
      </footer>
    </div>
  );
}