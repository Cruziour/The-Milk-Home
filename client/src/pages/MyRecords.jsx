import React, { useState, useEffect, useCallback } from "react";
import { Droplets, CircleDollarSign, ArrowRightLeft, Loader2, Sun, Moon } from "lucide-react";
import { getAllMilkEntriesBySlNoService } from "../service/index.js";
import useToast from "../hooks/useToast";
import { useSelector } from "react-redux";

const MyRecords = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalMilk: 0, totalAmount: 0 });
  const { showError } = useToast();

  const user = useSelector(state => state.auth.user);

  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
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

  const fetchVendorRecords = useCallback(async () => {
    if (!user?.slNo) {
      showError("Vendor ID not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const response = await getAllMilkEntriesBySlNoService(
        user?.slNo,
        filters.month,
        filters.year
      );
      const resData = response.data;
      const entriesList = resData.entries || [];
      const totals = resData.totalSummary || {};

      setRecords(entriesList);

      setSummary({
        totalMilk: (totals.morningQty || 0) + (totals.eveningQty || 0),
        totalAmount: (totals.morningAmount || 0) + (totals.eveningAmount || 0),
      });
    } catch (err) {
      showError(err.response?.data?.message || "Record fetch karne mein galti hui");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [user?.slNo, showError, filters.month, filters.year]);

  useEffect(() => {
    fetchVendorRecords();
  }, [fetchVendorRecords]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER SECTION */}
      <div className="bg-indigo-700 text-white pt-8 pb-14 px-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest italic">
              Vendor Portal
            </p>
            <h1 className="text-2xl font-black tracking-tight">{user?.name}</h1>
            <p className="text-xs opacity-80 font-medium">
              ID: {user?.slNo} • {user?.milkType}
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-5 rounded-4xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={16} className="text-blue-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Total Milk</span>
            </div>
            <h2 className="text-xl font-black text-gray-900">
              {summary.totalMilk.toFixed(2)} <span className="text-xs font-normal">Ltr</span>
            </h2>
          </div>
          <div className="bg-white p-5 rounded-4xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CircleDollarSign size={16} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Earnings</span>
            </div>
            <h2 className="text-xl font-black text-gray-900">₹{summary.totalAmount.toFixed(0)}</h2>
          </div>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="px-6 -mt-6">
        <div className="bg-white p-2 rounded-2xl shadow-md flex items-center gap-2 border border-gray-100">
          <select
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: e.target.value })}
            className="flex-1 bg-gray-50 py-2.5 px-4 rounded-xl text-sm font-bold text-gray-700 outline-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={filters.year}
            onChange={e => setFilters({ ...filters, year: e.target.value })}
            className="w-24 bg-gray-50 py-2.5 px-2 rounded-xl text-sm font-bold text-gray-700 outline-none text-center"
          />
        </div>
      </div>

      {/* DAILY RECORDS */}
      <div className="mt-8 px-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : records.length > 0 ? (
          records.map(row => (
            <div
              key={row._id}
              className="bg-white rounded-[1.8rem] shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* DATE STRIP */}
              <div className="bg-gray-50/80 px-6 py-3 border-b flex justify-between items-center">
                <span className="text-sm font-black text-gray-700">
                  {new Date(row.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Total Milk: ₹{row.dayTotalMilk}
                  </span>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Total: ₹{row.dayTotalAmount}
                  </span>
                </div>
              </div>

              {/* MORNING / EVENING GRID */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {/* MORNING */}
                <div
                  className={`p-4 rounded-2xl ${row.morning?.qty > 0 ? "bg-orange-50/50 border border-orange-100" : "opacity-30"}`}
                >
                  <div className="flex items-center gap-2 text-orange-600 mb-3">
                    <Sun size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase">Morning</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-gray-900 leading-tight">
                      {row.morning?.qty || 0}{" "}
                      <span className="text-[10px] font-normal uppercase">Ltr</span>
                    </p>
                    <p className="text-xs font-bold text-orange-700">₹{row.morning?.amount || 0}</p>
                  </div>
                </div>

                {/* EVENING */}
                <div
                  className={`p-4 rounded-2xl ${row.evening?.qty > 0 ? "bg-blue-50/50 border border-blue-100" : "opacity-30"}`}
                >
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <Moon size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase">Evening</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-gray-900 leading-tight">
                      {row.evening?.qty || 0}{" "}
                      <span className="text-[10px] font-normal uppercase">Ltr</span>
                    </p>
                    <p className="text-xs font-bold text-blue-700">₹{row.evening?.amount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl mx-2 border border-dashed border-gray-200">
            <ArrowRightLeft className="mx-auto text-gray-200 mb-2" size={40} />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              No Records Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecords;
