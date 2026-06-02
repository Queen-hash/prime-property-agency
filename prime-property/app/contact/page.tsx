"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHp: "",
    pesan: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 1. Validasi Client-Side
    if (!formData.nama || !formData.email || !formData.noHp || !formData.pesan) {
      toast.error("Semua kolom wajib diisi!");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Format email tidak valid!");
      return;
    }
    if (formData.noHp.length < 10) {
      toast.error("Nomor HP minimal 10 digit!");
      return;
    }

    // 2. Kirim ke API
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // 3. Notifikasi Sukses
      toast.success("Pesan terkirim, tim kami akan menghubungi Anda.", {
        duration: 5000,
      });
      
      setFormData({ nama: "", email: "", noHp: "", pesan: "" });

    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim pesan.");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeUpVariant: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#1A1A1A]">
      <Toaster position="top-center" />

      {/* HEADER */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <img src="/logo.png" alt="Logo Prime Property" className="h-13 md:h-17 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#1A1A1A]">
            <Link href="/" className="hover:text-[#C9A961] transition-colors">Beranda</Link>
            <Link href="/about" className="hover:text-[#C9A961] transition-colors">Tentang Kami</Link>
            <Link href="/contact" className="text-[#C9A961] font-bold transition-colors">Kontak</Link>
          </nav>
        </div>
      </header>

      <main className="py-16 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate="show"
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Hubungi Kami</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Tim profesional kami siap membantu Anda menemukan properti impian atau peluang investasi terbaik. Jangan ragu untuk menghubungi kami.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* KOLOM KIRI: INFO KONTAK & MAPS */}
          <motion.div 
            variants={fadeUpVariant}
            initial="hidden"
            animate="show"
            className="w-full lg:w-1/2 flex flex-col gap-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Informasi Kantor</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-[#C9A961] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Alamat Utama</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">District 8, SCBD Lot 28<br/>Jl. Jend. Sudirman Kav 52-53<br/>Jakarta Selatan, 12190</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-[#C9A961] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Telepon & WhatsApp</h4>
                    <p className="text-gray-500 text-sm mb-1">+62 21 1234 5678</p>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-[#C9A961] text-sm hover:underline font-medium">Chat via WhatsApp →</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-[#C9A961] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Email</h4>
                    <p className="text-gray-500 text-sm">consultation@primeproperty.id</p>
                  </div>
                </div>
              </div>
            </div>

            {/* EMBED GOOGLE MAPS */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 relative bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2736465495515!2d106.80373261536968!3d-6.227604495491959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14371fa9d1b%3A0xc3b83c51f479a973!2sDistrict%208%20SCBD!5e0!3m2!1sen!2sid!4v1689178302000!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kantor Prime Property"
              ></iframe>
            </div>
          </motion.div>

          {/* KOLOM KANAN: FORM KONTAK */}
          <motion.div 
            variants={fadeUpVariant}
            initial="hidden"
            animate="show"
            className="w-full lg:w-1/2"
          >
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Kirim Pesan</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Nama Lengkap</label>
                  <input 
                    type="text" name="nama" value={formData.nama} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] transition-all"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Email</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] transition-all"
                      placeholder="nama@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Nomor HP</label>
                    <input 
                      type="text" name="noHp" value={formData.noHp} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] transition-all"
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Pesan</label>
                  <textarea 
                    name="pesan" value={formData.pesan} onChange={handleChange} rows={5}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961] resize-none transition-all"
                    placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] text-[#C9A961] font-bold py-3.5 rounded-xl hover:bg-[#C9A961] hover:text-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </main>

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