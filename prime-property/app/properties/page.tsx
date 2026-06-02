"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase"; // Pastikan path-nya sesuai
import { motion } from "framer-motion"; // <-- TAMBAHAN IMPORT FRAMER MOTION

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Filter & Pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // 'in_stock' | 'sold_out' | ''
  const [tipeFilter, setTipeFilter] = useState("");     // 'Villa' | 'Ruko' | ''
  const [siapFilter, setSiapFilter] = useState("");     // 'siap_huni' | 'siap_kosong' | 'siap_huni_renovasi' | ''

  useEffect(() => {
    const fetchAllProperties = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
        
      if (data) setProperties(data);
      setIsLoading(false);
    };

    fetchAllProperties();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  // Logic Menyaring Data Berdasarkan Filter yang Aktif
  const filteredProperties = properties.filter((prop) => {
    const matchSearch = prop.nama_property.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        prop.kawasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "" || prop.status === statusFilter;
    const matchTipe = tipeFilter === "" || prop.tipe === tipeFilter;
    const matchSiap = siapFilter === "" || prop.siap === siapFilter;
    
    return matchSearch && matchStatus && matchTipe && matchSiap;
  });

  // Fungsi untuk toggle filter (kalau diklik 2x, filternya mati)
  const toggleFilter = (setter: any, currentValue: string, targetValue: string) => {
    setter(currentValue === targetValue ? "" : targetValue);
  };

  // ==========================================
  // VARIANTS ANIMASI FRAMER MOTION
  // ==========================================
 const fadeUpVariant: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 
      }
    }
  };

  const cardVariant: any = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#1A1A1A]">
      
      {/* HEADER STICKY */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <img src="/logo.png" alt="Logo Prime Property" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#1A1A1A]">
            <Link href="/" className="hover:text-[#C9A961] transition-colors">Beranda</Link>
            <Link href="/about" className="hover:text-[#C9A961] transition-colors">Tentang Kami</Link>
            <Link href="/contact" className="hover:text-[#C9A961] transition-colors">Kontak</Link>
          </nav>
        </div>
      </header>

      <main className="pt-10 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
        
        {/* KOTAK PENCARIAN & FILTER (Dengan Animasi Fade Up) */}
        <motion.div 
          variants= {fadeUpVariant}
          initial="hidden"
          animate="show"
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10"
        >
          {/* Baris 1: Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari nama properti atau kawasan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40 focus:border-[#C9A961] transition-all"
            />
          </div>

          {/* Baris 2: Tombol Filter (Pills) */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400 font-medium mr-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Filter:
            </div>

            {/* Grup Filter Status */}
            <div className="flex gap-2 border-r border-gray-200 pr-4">
              <button onClick={() => toggleFilter(setStatusFilter, statusFilter, 'in_stock')} className={`px-4 py-1.5 rounded-full border transition-all ${statusFilter === 'in_stock' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>In Stock</button>
              <button onClick={() => toggleFilter(setStatusFilter, statusFilter, 'sold_out')} className={`px-4 py-1.5 rounded-full border transition-all ${statusFilter === 'sold_out' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>Sold Out</button>
            </div>

            {/* Grup Filter Tipe */}
            <div className="flex gap-2 border-r border-gray-200 pr-4">
              <button onClick={() => toggleFilter(setTipeFilter, tipeFilter, 'Villa')} className={`px-4 py-1.5 rounded-full border transition-all ${tipeFilter === 'Villa' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>Villa</button>
              <button onClick={() => toggleFilter(setTipeFilter, tipeFilter, 'Ruko')} className={`px-4 py-1.5 rounded-full border transition-all ${tipeFilter === 'Ruko' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>Ruko</button>
            </div>

            {/* Grup Filter Kesiapan */}
            <div className="flex gap-2">
              <button onClick={() => toggleFilter(setSiapFilter, siapFilter, 'siap_huni')} className={`px-4 py-1.5 rounded-full border transition-all ${siapFilter === 'siap_huni' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>Siap Huni</button>
              <button onClick={() => toggleFilter(setSiapFilter, siapFilter, 'siap_kosong')} className={`px-4 py-1.5 rounded-full border transition-all ${siapFilter === 'siap_kosong' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>Siap Kosong</button>
              <button onClick={() => toggleFilter(setSiapFilter, siapFilter, 'siap_huni_renovasi')} className={`px-4 py-1.5 rounded-full border transition-all ${siapFilter === 'siap_huni_renovasi' ? 'bg-[#C9A961] text-white border-[#C9A961]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>Renovasi</button>
            </div>
            
            {/* Tombol Reset */}
            {(searchTerm || statusFilter || tipeFilter || siapFilter) && (
              <button 
                onClick={() => { setSearchTerm(""); setStatusFilter(""); setTipeFilter(""); setSiapFilter(""); }} 
                className="ml-auto text-rose-500 hover:text-rose-600 font-medium text-xs underline underline-offset-2"
              >
                Reset Filter
              </button>
            )}
          </div>
        </motion.div>

        {/* INFO HASIL PENCARIAN */}
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate="show"
          className="mb-6 text-sm text-gray-500"
        >
          Menampilkan <span className="font-bold text-[#1A1A1A]">{filteredProperties.length}</span> properti
        </motion.div>

        {/* GRID PROPERTI */}
        {isLoading ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <motion.div variants={cardVariant} key={n} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col animate-pulse">
                <div className="h-56 bg-gray-200 w-full relative">
                  <div className="absolute top-4 left-4 bg-gray-300 h-6 w-12 rounded-md"></div>
                  <div className="absolute top-4 right-4 bg-gray-300 h-6 w-16 rounded-md"></div>
                  <div className="absolute bottom-4 left-4 bg-gray-300 h-7 w-36 rounded-md"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  <div className="bg-gray-200 h-3 w-24 rounded-full"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded-full mb-1"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded-full mb-4"></div>
                  <div className="mt-auto pt-4 border-t border-gray-100/80 flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="bg-gray-200 h-4 w-16 rounded-full"></div>
                      <div className="bg-gray-200 h-4 w-12 rounded-full"></div>
                    </div>
                    <div className="bg-gray-200 h-4 w-20 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : filteredProperties.length === 0 ? (
          <motion.div 
            variants={fadeUpVariant}
            initial="hidden"
            animate="show"
            className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-gray-100"
          >
            Tidak ada properti yang cocok dengan filter pencarian Anda.
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((prop) => (
              <motion.div variants={cardVariant} key={prop.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C9A961]/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
                
                {/* AREA GAMBAR FOTO */}
                <div className="h-56 relative overflow-hidden group">
                  <img 
                    src={prop.tipe === 'Villa' 
                      ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop' 
                      : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop'} 
                    alt={prop.nama_property}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-0"></div>
                  
                  <div className="absolute top-4 left-4 bg-white text-[#1A1A1A] px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
                    {prop.tipe}
                  </div>
                  
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1.5 text-[10px] rounded-md font-bold uppercase tracking-wider shadow-sm ${prop.status === 'in_stock' ? 'bg-[#C9A961] text-white' : 'bg-[#B33A3A] text-white'}`}>
                      {prop.status === 'in_stock' ? 'Tersedia' : 'Terjual'}
                    </span>
                  </div>

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
      </main>
    </div>
  );
}