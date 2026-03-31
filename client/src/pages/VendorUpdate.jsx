import React, { useState } from "react";
import axios from "axios";
import {
  UserCog,
  Search,
  Save,
  MapPin,
  User,
  Power,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Hash,
  X,
} from "lucide-react";

const VendorUpdate = () => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter a Name or Serial Number to search.");
      return;
    }

    setLoading(true);
    setError(null);
    setVendorList([]);
    setSelectedVendor(null);

    try {
      const response = await axios.get(`/api/vendors/search`, {
        params: { query: searchInput.trim() },
      });

      const data = response.data;

      if (data.length === 0) {
        setError("No vendor found with this detail.");
      } else if (data.length === 1) {
        // Agar exact 1 match milta hai (e.g. Sl No se)
        setSelectedVendor(data[0]);
      } else {
        // Agar same naam ke multiple log milte hain
        setVendorList(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      await axios.put(`/api/vendors/update/${selectedVendor._id}`, selectedVendor);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedVendor(null);
        setSearchInput("");
        setVendorList([]);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-4xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Top Header */}
        <div className="bg-indigo-600 px-6 py-8 text-center text-white">
          <UserCog className="mx-auto mb-2 opacity-80" size={32} />
          <h1 className="text-xl font-black uppercase tracking-widest">Vendor Management</h1>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {!selectedVendor && (
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter Name OR Serial Number..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {searchInput && (
                    <X
                      size={18}
                      className="text-gray-400 cursor-pointer hover:text-red-500"
                      onClick={() => setSearchInput("")}
                    />
                  )}
                  <Search
                    size={20}
                    className="text-gray-300 group-focus-within:text-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : "Search Vendor"}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in zoom-in-95">
              <AlertCircle size={18} />
              <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          {vendorList.length > 1 && !selectedVendor && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Select Correct User:
                </span>
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {vendorList.length} matches
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {vendorList.map(v => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVendor(v)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-indigo-500 hover:bg-white transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl font-black text-xs text-indigo-600 shadow-sm">
                        #{v.slNo}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-gray-800 uppercase leading-none mb-1">
                          {v.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {v.address}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVendor && (
            <form
              onSubmit={handleUpdate}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white p-2 rounded-xl">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Serial No: {selectedVendor.slNo}
                    </p>
                    <p className="text-sm font-black text-gray-800 uppercase">Updating Profile</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVendor(null);
                    setVendorList([]);
                  }}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                    value={selectedVendor.name}
                    onChange={e => setSelectedVendor({ ...selectedVendor, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Account Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVendor({ ...selectedVendor, isActive: !selectedVendor.isActive })
                    }
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-black text-[10px] uppercase ${
                      selectedVendor.isActive
                        ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                        : "bg-red-50 border-red-500 text-red-600"
                    }`}
                  >
                    {selectedVendor.isActive ? "Active" : "Deactivated"}
                    <Power size={14} className={selectedVendor.isActive ? "animate-pulse" : ""} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                  <MapPin size={12} /> Address / Village
                </label>
                <textarea
                  rows="2"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none resize-none"
                  value={selectedVendor.address}
                  onChange={e => setSelectedVendor({ ...selectedVendor, address: e.target.value })}
                />
              </div>

              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center gap-3 border border-emerald-100 animate-in zoom-in-95">
                  <CheckCircle2 size={20} />
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    Changes Saved Successfully!
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {updating ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {updating ? "Processing..." : "Save Changes"}
              </button>
            </form>
          )}

          {!selectedVendor && vendorList.length === 0 && !loading && (
            <div className="text-center py-12 opacity-30 flex flex-col items-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Hash size={32} className="text-gray-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Data Selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorUpdate;
