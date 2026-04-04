import React, { useState } from "react";
import {
  UserCog,
  Search,
  Save,
  MapPin,
  User,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Hash,
  X,
  Phone,
  Droplets,
  PencilLine,
  ShieldCheck,
} from "lucide-react";
import { getUserBySlNoAndNameService, updateVendorService } from "../service/index.js";
import useToast from "../hooks/useToast.js";
import Toast from "../components/common/Toast.jsx";

const VendorUpdate = () => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [formData, setFormData] = useState({
    slNo: "",
    name: "",
    phone: "",
    address: "",
    milkType: "cow",
    isActive: true,
    password: "",
  });

  const handleChange = e => {
    setError(null);
    const { name, value } = e.target;

    if (name === "isActive") {
      const isTrue = value === "true";
      setFormData(prev => ({
        ...prev,
        isActive: isTrue,
        slNo: isTrue ? prev.slNo : "",
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const selectUser = user => {
    setFormData({
      _id: user._id,
      slNo: user.slNo || "",
      name: user.name || "",
      phone: user.phone || user.mobile || "",
      address: user.address || "",
      milkType: user.milkType || "cow",
      isActive: user.isActive ?? true,
      password: user.password || "",
    });
    setSelectedVendor(user);
    setVendorList([]);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return setError("Please enter search detail.");
    setLoading(true);
    setError(null);
    try {
      const res = await getUserBySlNoAndNameService({ slNo: searchInput.trim() });
      if (res.data.length === 0) {
        setError("No vendor found with these details.");
        showError("No vendor found with these details.");
      } else if (res.data.length === 1) {
        selectUser(res.data[0]);
        showSuccess(res?.message);
      } else {
        setVendorList(res.data);
        showSuccess(res?.message);
      }
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    try {
      const res = await updateVendorService(formData._id, formData);

      setSuccess(true);
      showSuccess(res.message);
      setTimeout(() => {
        setSuccess(false);
        setSelectedVendor(null);
        setSearchInput("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please check inputs.");
      showError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#f8fafc] p-4 md:p-8 flex justify-center items-start md:items-center">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden border border-gray-100">
        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <UserCog className="mx-auto mb-3 drop-shadow-md" size={40} />
          <h1 className="text-2xl font-black uppercase tracking-[0.2em]">Vendor Update</h1>
          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
            Database Management System
          </p>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          {/* Search Section */}
          {!selectedVendor && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="group relative">
                <input
                  className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-gray-700 shadow-sm"
                  placeholder="Search by Name or SL No..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && handleSearch()}
                />
                <Search
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                  size={22}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex justify-center items-center gap-3"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : "FIND VENDOR"}
              </button>
            </div>
          )}

          {/* Multiple Results List */}
          {vendorList.length > 1 && !selectedVendor && (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                Multiple matches found:
              </p>
              <div className="space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {vendorList.map(v => (
                  <button
                    key={v._id}
                    onClick={() => selectUser(v)}
                    className="w-full flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {v.slNo || "?"}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 uppercase text-sm leading-tight">
                          {v.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 truncate max-w-50">
                          {v.address}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edit Form */}
          {selectedVendor && (
            <form
              onSubmit={handleUpdate}
              className="space-y-6 animate-in slide-in-from-bottom-8 duration-700"
            >
              {/* Profile Card Header */}
              <div className="flex justify-between items-center bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase">
                      {selectedVendor.name}
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 tracking-tighter">
                      ID: {selectedVendor?._id}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Status - Styled Toggle Look */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Vendor Status
                  </label>
                  <select
                    name="isActive"
                    value={formData.isActive.toString()}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 font-black outline-none transition-all cursor-pointer shadow-sm ${
                      formData.isActive
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 focus:border-emerald-500"
                        : "bg-rose-50 border-rose-100 text-rose-700 focus:border-rose-500"
                    }`}
                  >
                    <option value="true">🟢 ACTIVE (Assigned)</option>
                    <option value="false">🔴 INACTIVE (Free)</option>
                  </select>
                </div>

                {/* SL No */}
                {formData.isActive && (
                  <div className="space-y-2 animate-in zoom-in-95 duration-300">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Hash size={12} className="text-indigo-500" /> Serial No
                    </label>
                    <input
                      name="slNo"
                      type="number"
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      value={formData?.slNo}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <PencilLine size={12} className="text-indigo-500" /> Full Name
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    value={formData?.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-indigo-500" /> Mobile
                  </label>
                  <input
                    name="phone"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    value={formData?.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-indigo-500" /> Password
                  </label>
                  <input
                    name="password"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    value={formData?.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Droplets size={12} className="text-indigo-500" /> Milk Type
                  </label>
                  <select
                    name="milkType"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                    value={formData?.milkType}
                    onChange={handleChange}
                  >
                    <option value="cow">🐄 Cow Milk</option>
                    <option value="buffalo">🐃 Buffalo Milk</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-indigo-500" /> Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                  value={formData?.address}
                  onChange={handleChange}
                />
              </div>

              {/* Status Messages */}
              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl border border-rose-100 flex items-center gap-3 animate-shake">
                  <AlertCircle size={20} className="shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in zoom-in-95">
                  <CheckCircle2 size={20} className="shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    Data synchronized successfully!
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all flex justify-center items-center gap-3"
              >
                {updating ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                {updating ? "SYNCING..." : "COMMIT CHANGES"}
              </button>
            </form>
          )}

          {/* Empty State */}
          {!selectedVendor && vendorList.length === 0 && !loading && (
            <div className="text-center py-10 opacity-20 select-none">
              <Hash size={48} className="mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Ready for lookup</p>
            </div>
          )}
        </div>
      </div>

      {/* Global Style for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e7ff; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c7d2fe; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default VendorUpdate;
