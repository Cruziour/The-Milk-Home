import React, { useState } from "react";
import axios from "axios";
import {
  FileText,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CalendarDays,
  Hash,
  RefreshCw,
  XCircle,
} from "lucide-react";

const Report = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    month: "", // Khali rakha hai validation ke liye
    year: new Date().getFullYear(),
    slNo: "",
    format: "excel",
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Sirf numbers allow karne ke liye function
  const handleSlNoChange = e => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setFilters({ ...filters, slNo: value });
    }
  };

  const handleDownload = async () => {
    // Validation: Agar Month ya Year khali hai to ruk jao
    if (!filters.month || !filters.year) {
      setError("Please select both Month and Year.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        filters.format === "excel" ? "/api/reports/export-excel" : "/api/reports/export-pdf";

      const response = await axios.get(endpoint, {
        params: {
          month: filters.month,
          year: filters.year,
          slNo: filters.slNo,
        },
        responseType: "blob",
      });

      // Check if blob is actually an error message (JSON)
      if (response.data.type === "application/json") {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "File not found on server.");
      }

      const fileType =
        filters.format === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/pdf";

      const extension = filters.format === "excel" ? "xlsx" : "pdf";

      const url = window.URL.createObjectURL(new Blob([response.data], { type: fileType }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Milk_Report_${filters.month}_${filters.year}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Backend error handling
      setError(err.message || "Server error: File could not be generated.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
            Export <span className="text-indigo-600">Center</span>
          </h1>
        </div>

        <div className="space-y-5">
          {/* Month */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <CalendarDays size={12} /> Month
            </label>
            <select
              value={filters.month}
              className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${!filters.month ? "border-red-100" : "border-gray-100 focus:border-indigo-500"}`}
              onChange={e => setFilters({ ...filters, month: e.target.value })}
            >
              <option value="">-- Choose Month --</option>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              Year
            </label>
            <input
              type="number"
              value={filters.year}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-indigo-500 outline-none"
              onChange={e => setFilters({ ...filters, year: e.target.value })}
            />
          </div>

          {/* Serial Number (Numbers Only) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <Hash size={12} /> Serial No
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Numbers only (Optional)"
              value={filters.slNo}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-indigo-500 outline-none"
              onChange={handleSlNoChange}
            />
          </div>

          {/* Format */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setFilters({ ...filters, format: "excel" })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase border-2 transition-all ${
                filters.format === "excel"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                  : "border-gray-100 text-gray-400"
              }`}
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button
              onClick={() => setFilters({ ...filters, format: "pdf" })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase border-2 transition-all ${
                filters.format === "pdf"
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-100 text-gray-400"
              }`}
            >
              <FileText size={16} /> PDF
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={loading || !filters.month}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed mt-4 shadow-xl shadow-indigo-100"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
            {loading ? "Processing..." : "Download File"}
          </button>

          {/* Error Message Section */}
          {error && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-bounce">
              <XCircle size={18} />
              <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
