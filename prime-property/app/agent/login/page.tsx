"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email dan Password wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      localStorage.setItem("agent_role", data.role);
      localStorage.setItem("agent_email", formData.email);
    
      toast.success("Login berhasil! Mengalihkan...", { duration: 2000 });
      
      // Redirect ke dashboard
      setTimeout(() => {
        router.push("/agent/dashboard"); 
      }, 1500);

    } catch (error: any) {
      toast.error(error.message || "Gagal login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      <Toaster position="top-center" />

      {/* SISI KIRI: GAMBAR */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Prime Property Building" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Logo / Teks di Atas Gambar */}
        <div className="absolute bottom-12 left-12 z-10">
          <Link href="/">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Prime <span className="text-[#C9A961]">Property</span></h2>
          </Link>
          <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
            Portal manajemen eksklusif untuk agen dan admin internal Prime Property.
          </p>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        
        {/* Tombol kembali ke Beranda */}
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-gray-400 hover:text-[#1A1A1A] transition-colors flex items-center gap-2">
          ← Kembali ke Web
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="admin@primeproperty.id"
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1A1A1A] text-white font-bold py-3.5 rounded-lg hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6 shadow-md"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Info Lupa Password Enterprise-style */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Lupa kata sandi atau kehilangan akses? <br/>
              <span className="font-semibold text-[#1A1A1A]">Silakan hubungi Superadmin sistem.</span>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}