import React, { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Download,
  CalendarDays,
  Hash,
  RefreshCw,
  XCircle,
  Table as TableIcon,
  Search,
} from "lucide-react";
import {
  exportMilkEntriesService,
  getAllMilkEntriesBySlNoService,
  getAllMilkEntriesService,
} from "../service/index.js";
import useToast from "../hooks/useToast.js";
import Toast from "../components/common/Toast.jsx";

const Report = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [totals, setTotals] = useState({ qty: 0, amt: 0 });

  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
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

  const fetchData = async () => {
    setLoading(true);

    try {
      let response;
      if (filters.slNo) {
        response = await getAllMilkEntriesBySlNoService(filters.slNo, filters.month, filters.year);
      } else {
        response = await getAllMilkEntriesService(filters.month, filters.year);
      }

      const data = filters.slNo ? response.data.entries : response.data;
      setTableData(data);
      showSuccess(response.message);

      const summary = data.reduce(
        (acc, curr) => ({
          qty: acc.qty + Number(curr.dayTotalMilk || 0),
          amt: acc.amt + Number(curr.dayTotalAmount || 0),
        }),
        { qty: 0, amt: 0 }
      );
      setTotals(summary);
    } catch (err) {
      showError(err.message);
      setTableData([]);
      setTotals({ qty: 0, amt: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!filters.month || !filters.year) {
      showError("Please select both Month and Year.");
      return;
    }
    setLoading(true);

    try {
      const response = await exportMilkEntriesService(
        filters.slNo,
        filters.month,
        filters.year,
        filters.format
      );

      if (!response || !response.data) {
        throw new Error("No response from server");
      }

      if (response.data?.type === "application/json") {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Export failed");
      }

      const blob = new Blob([response.data], {
        type:
          filters.format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Milk_Report_${filters.month}_${filters.year}.${filters.format === "excel" ? "xlsx" : "pdf"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Milk <span className="text-indigo-600">Analytics</span>
            </h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              Monthly Business Intelligence
            </p>
          </div>

          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
            <button
              onClick={() => setActiveTab("view")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "view" ? "bg-indigo-950 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <TableIcon size={14} /> View Data
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "export" ? "bg-indigo-950 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <Download size={14} /> Export Center
            </button>
          </div>
        </div>

        {/* Global Filters Bar */}
        <div className="bg-white p-6 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest flex items-center gap-2 ml-1">
              <CalendarDays size={12} /> Month
            </label>
            <select
              value={filters.month}
              onChange={e => setFilters({ ...filters, month: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-indigo-500 outline-none transition-all"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest ml-1">
              Year
            </label>
            <input
              type="number"
              value={filters.year}
              onChange={e => setFilters({ ...filters, year: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest flex items-center gap-2 ml-1">
              <Hash size={12} /> SL No (Optional)
            </label>
            <input
              type="text"
              placeholder="Ex: 101"
              value={filters.slNo}
              onChange={e => setFilters({ ...filters, slNo: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-gray-900 text-white h-11.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-gray-200"
          >
            {loading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
            Filter Data
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "view" ? (
          <div className="bg-white rounded-4xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-center">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950 text-left">
                      Farmer
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950 text-left">
                      Address
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950">
                      Morning (L)
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950">
                      Evening (L)
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950">
                      Total Ltr
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black uppercase text-gray-950">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-center">
                  {tableData.length > 0 ? (
                    <>
                      {tableData.map(row => (
                        <tr key={row._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-gray-600">
                            {new Date(row.date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-6 py-4 text-left">
                            <div className="text-sm font-black text-gray-900">
                              {row.vendor?.name}
                            </div>
                            <div className="text-[10px] font-bold text-gray-950 italic">
                              SL: {row.vendor?.slNo}
                            </div>
                          </td>
                          {/* Address Column */}
                          <td className="px-6 py-4 text-left text-[10px] font-bold text-gray-950 uppercase">
                            {row.vendor?.address || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-red-800">
                            {row.morning?.qty}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">
                            {row.evening?.qty}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-gray-950">
                            {Number(row.dayTotalMilk || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-indigo-950">
                            ₹{Number(row.dayTotalAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* GRAND TOTAL ROW - FIX 3: Adjusted colSpan for the new Address column */}
                      <tr className="bg-indigo-50/50 border-t-2 border-indigo-100">
                        <td
                          colSpan="5"
                          className="px-6 py-5 text-xs font-black text-indigo-900 uppercase text-right tracking-widest"
                        >
                          Grand Total:
                        </td>
                        <td className="px-6 py-5 text-xs font-black text-gray-900">
                          {totals.qty.toFixed(2)} Ltr
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-indigo-700 underline decoration-double decoration-indigo-200 underline-offset-4">
                          ₹{totals.amt.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic"
                      >
                        {loading ? "Searching entries..." : "No data found for this period"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* EXPORT VIEW */
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="text-indigo-600" size={28} />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
                Export Files
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                Choose your preferred format
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setFilters({ ...filters, format: "excel" })}
                  className={`flex flex-col items-center gap-3 p-6 rounded-4xl border-2 transition-all ${filters.format === "excel" ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-gray-50 text-gray-400"}`}
                >
                  <FileSpreadsheet size={24} />
                  <span className="text-[9px] font-black uppercase">Excel Sheet</span>
                </button>
                <button
                  onClick={() => setFilters({ ...filters, format: "pdf" })}
                  className={`flex flex-col items-center gap-3 p-6 rounded-4xl border-2 transition-all ${filters.format === "pdf" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-50 text-gray-400"}`}
                >
                  <FileText size={24} />
                  <span className="text-[9px] font-black uppercase">PDF Report</span>
                </button>
              </div>

              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-100 disabled:bg-gray-100"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <Download size={16} />
                )}
                {loading ? "Preparing File..." : `Download ${filters.format.toUpperCase()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
