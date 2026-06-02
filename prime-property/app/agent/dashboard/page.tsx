"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<"admin" | "superadmin" | null>(null);
  const [userEmail, setUserEmail] = useState<string>(""); 

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nama_property: "", group: "", lebar: 0, panjang: 0, hadap: "Utara",
    tipe: "Villa", tingkat: 1, price: 0, carport: false, status: "in_stock",
    siap: "siap_huni", kawasan: ""
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('agent_email') || 'Unknown User';
      const role = localStorage.getItem('agent_role') || 'admin';
      setUserEmail(email);
      setUserRole(role as "admin" | "superadmin"); 
    }
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("properties").select("*").is("deleted_at", null).order("created_at", { ascending: false });
    if (!error && data) setProperties(data);
    setIsLoading(false);
  };

  const fetchAuditLogs = async () => {
    try {
      // KODE BARU: Nembak ke API Backend lu yang pegang Kunci Master
      const response = await fetch('/api/audit');
      const result = await response.json();

      if (response.ok && result.data) {
        setAuditLogs(result.data);
      } else {
        console.error("Gagal mengambil log:", result.error);
      }
    } catch (error) {
    console.error("Error fetching logs:", error);
    } 
  };

  const openAuditModal = () => {
    fetchAuditLogs();
    setIsAuditModalOpen(true);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Nembak ke API baru kita, bukan langsung ke Supabase
  const handleSubmitProperty = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const action = modalMode === "add" ? "INSERT" : "UPDATE";
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action, 
          payload: formData, 
          id: editingId, 
          property_name: formData.nama_property 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error); // Bakal nangkep error 403 Forbidden

      toast.success(`Properti berhasil di${modalMode === "add" ? "tambahkan" : "perbarui"}!`);
      setIsModalOpen(false);
      fetchProperties();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({ nama_property: "", group: "", lebar: 0, panjang: 0, hadap: "Utara", tipe: "Villa", tingkat: 1, price: 0, carport: false, status: "in_stock", siap: "siap_huni", kawasan: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (property: any) => {
    setModalMode("edit");
    setEditingId(property.id);
    setFormData(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus properti "${nama}"?`)) return;
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", id, property_name: nama })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Properti berhasil dihapus!");
      fetchProperties();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== 'undefined') {
          localStorage.removeItem('agent_role');
          localStorage.removeItem('agent_email');
      }
      router.push("/agent/login");
    } catch (error) {}
  };

  const filteredProperties = properties.filter((prop) => {
    const matchSearch = prop.nama_property.toLowerCase().includes(searchTerm.toLowerCase()) || prop.kawasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipe = filterTipe === "Semua" || prop.tipe === filterTipe;
    const matchStatus = filterStatus === "Semua" || prop.status === filterStatus;
    return matchSearch && matchTipe && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Toaster position="top-right" />
      
      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-800 tracking-tight">Prime <span className="text-[#C9A961]">Dashboard</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700">{userEmail}</p>
              <p className="text-xs text-[#C9A961] font-bold uppercase tracking-wider">{userRole}</p>
            </div>
            <button onClick={handleLogout} className="text-sm font-medium text-rose-500 hover:text-rose-600 border border-rose-100 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Properti</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola listing, update status, dan monitor inventaris properti.</p>
          </div>
          <div className="flex gap-3">
            {/* HANYA SUPERADMIN YANG BISA LIHAT TOMBOL INI */}
            {userRole === "superadmin" && (
              <>
                <button onClick={openAuditModal} className="bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  Lihat Log Aktivitas
                </button>
                <button onClick={openAddModal} className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                  Tambah Properti
                </button>
              </>
            )}
          </div>
        </div>

        {/* FILTER BAR (Tetap Sama) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input type="text" placeholder="Cari properti atau kawasan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40" />
          </div>
          <div className="flex gap-4">
            <select value={filterTipe} onChange={(e) => setFilterTipe(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"><option value="Semua">Semua Tipe</option><option value="Villa">Villa</option><option value="Ruko">Ruko</option></select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"><option value="Semua">Semua Status</option><option value="in_stock">In Stock</option><option value="sold_out">Sold Out</option></select>
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Properti</th>
                  <th className="px-6 py-4">Kawasan</th>
                  <th className="px-6 py-4">Tipe & Dimensi</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Status</th>
                  {/* Kolom Aksi Hanya Muncul Buat Superadmin */}
                  {userRole === "superadmin" && <th className="px-6 py-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={userRole === "superadmin" ? 6 : 5} className="px-6 py-12 text-center text-slate-400">Memuat data...</td></tr>
                ) : filteredProperties.length === 0 ? (
                  <tr><td colSpan={userRole === "superadmin" ? 6 : 5} className="px-6 py-12 text-center text-slate-400">Tidak ada properti ditemukan.</td></tr>
                ) : (
                  filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{prop.nama_property}</td>
                      <td className="px-6 py-4 text-slate-500">{prop.kawasan}</td>
                      <td className="px-6 py-4"><span className="font-medium">{prop.tipe}</span> <span className="text-slate-400 ml-1">({prop.lebar}x{prop.panjang})</span></td>
                      <td className="px-6 py-4 font-semibold text-slate-700">Rp {(prop.price / 1000000).toFixed(0)} Juta</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${prop.status === 'in_stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {prop.status.replace('_', ' ')}
                        </span>
                      </td>
                      {/* Tombol Aksi Hanya Muncul Buat Superadmin */}
                      {userRole === "superadmin" && (
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => openEditModal(prop)} className="text-[#C9A961] font-semibold hover:underline mr-4">Edit</button>
                          <button onClick={() => handleDelete(prop.id, prop.nama_property)} className="text-rose-500 font-semibold hover:underline">Hapus</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL AUDIT LOG */}
      {isAuditModalOpen && userRole === "superadmin" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Log Aktivitas Sistem</h2>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <tr><th className="px-6 py-4">Waktu</th><th className="px-6 py-4">User</th><th className="px-6 py-4">Aksi</th><th className="px-6 py-4">Nama Properti</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 text-slate-500 text-xs">{new Date(log.created_at).toLocaleString("id-ID")}</td>
                      <td className="px-6 py-3 font-medium text-slate-700">{log.user_email}</td>
                      <td className="px-6 py-3"><span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">{log.action}</span></td>
                      <td className="px-6 py-3 text-slate-700">{log.property_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM PROPERTI (Tetap Sama, tapi memanggil handleSubmitProperty) */}
      {isModalOpen && userRole === "superadmin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-lg font-bold text-slate-800">{modalMode === 'add' ? 'Tambah Properti Baru' : 'Edit Properti'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8">
              <form id="property-form" onSubmit={handleSubmitProperty} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama Properti *</label><input type="text" name="nama_property" required value={formData.nama_property} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Grup/Cluster</label><input type="text" name="group" value={formData.group} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipe Properti</label><select name="tipe" value={formData.tipe} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40"><option value="Villa">Villa</option><option value="Ruko">Ruko</option></select></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Lebar (m)</label><input type="number" step="0.1" name="lebar" value={formData.lebar} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div><div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Panjang (m)</label><input type="number" step="0.1" name="panjang" value={formData.panjang} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tingkat</label><input type="number" step="0.5" name="tingkat" value={formData.tingkat} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div><div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Hadap</label><select name="hadap" value={formData.hadap} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40"><option value="Utara">Utara</option><option value="Selatan">Selatan</option><option value="Timur">Timur</option><option value="Barat">Barat</option></select></div></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Harga (Rp) *</label><input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status Inventaris</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40"><option value="in_stock">In Stock</option><option value="sold_out">Sold Out</option></select></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Kondisi Siap</label><select name="siap" value={formData.siap} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40"><option value="siap_huni">Siap Huni</option><option value="siap_kosong">Siap Kosong</option><option value="siap_huni_renovasi">Siap Huni (Renovasi)</option></select></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Kawasan *</label><input type="text" name="kawasan" required value={formData.kawasan} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A961]/40" /></div>
                <div className="md:col-span-2 flex items-center mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/60"><input type="checkbox" name="carport" checked={formData.carport} onChange={handleInputChange} className="w-4 h-4 text-[#C9A961] accent-[#C9A961]" /><label className="ml-3 text-sm font-medium text-slate-700">Tersedia Fasilitas Carport</label></div>
              </form>
            </div>
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-200/50 rounded-xl transition-colors">Batal</button>
              <button type="submit" form="property-form" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-[#1A1A1A] bg-[#C9A961] hover:bg-[#b09353] rounded-xl transition-colors disabled:opacity-50">{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}