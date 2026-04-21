import React, { useState, useEffect, useCallback } from "react";
import {
  CircleDollarSign,
  Loader2,
  Wallet,
  CalendarDays,
  History,
  ReceiptText,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
} from "lucide-react";
import { getVendorLedgerService } from "../service/index.js";
import useToast from "../hooks/useToast";
import { useSelector } from "react-redux";

const PaymentHistory = () => {
  const [loading, setLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState({
    vouchers: [],
    summary: { openingBalance: 0, totalCredit: 0, totalDebit: 0, netPayable: 0 },
  });
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

  const fetchPaymentRecords = useCallback(async () => {
    if (!user?.slNo) return;
    setLoading(true);
    try {
      const response = await getVendorLedgerService(user.slNo, filters.month, filters.year);
      if (response.success) {
        setLedgerData({
          vouchers: response.data.vouchers.filter(v => v.dr > 0), // Sirf payments filter kiye
          summary: response.data.summary,
        });
      }
    } catch (err) {
      showError(err.message || "Payment history load nahi ho payi");
    } finally {
      setLoading(false);
    }
  }, [user?.slNo, filters.month, filters.year, showError]);

  useEffect(() => {
    fetchPaymentRecords();
  }, [fetchPaymentRecords]);

  return (
    <div className="min-h-screen bg-[#F4F7FE] pb-24">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white pt-8 pb-20 px-6 rounded-b-[3rem] shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">{user?.name}</h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mt-1">
              Account Statement • {user?.slNo}
            </p>
          </div>
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/40">
            <History size={20} />
          </div>
        </div>

        {/* ADMIN STYLE RECTANGLE SUMMARY */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-y-6">
            <div className="border-r border-white/10 pr-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Milk Value (Cr)
              </p>
              <h3 className="text-lg font-black text-emerald-400">
                ₹{ledgerData.summary.totalCredit.toLocaleString()}
              </h3>
            </div>
            <div className="pl-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total Paid (Dr)
              </p>
              <h3 className="text-lg font-black text-rose-400">
                ₹{ledgerData.summary.totalDebit.toLocaleString()}
              </h3>
            </div>
            <div className="border-r pr-4 pt-4 border-t border-white/10">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Opening Bal
              </p>
              <h3 className="text-lg font-black text-slate-200">
                ₹{ledgerData.summary.openingBalance.toLocaleString()}
              </h3>
            </div>
            <div className="pl-6 pt-4 border-t border-white/10">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                Net Balance
              </p>
              <h3 className="text-xl font-black text-white italic">
                ₹{ledgerData.summary.netPayable.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="px-6 -mt-8">
        <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2">
          <select
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: parseInt(e.target.value) })}
            className="flex-1 bg-slate-50 py-3 px-4 rounded-xl text-xs font-black text-slate-700 outline-none"
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
            className="w-24 bg-slate-50 py-3 px-2 rounded-xl text-xs font-black text-slate-700 outline-none text-center"
          />
        </div>
      </div>

      {/* PAYMENT LOGS */}
      <div className="mt-8 px-6 space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Transaction Logs
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {ledgerData.vouchers.length} Payments
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : ledgerData.vouchers.length > 0 ? (
          ledgerData.vouchers.map((pay, i) => (
            <div
              key={i}
              className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                    <ArrowDownLeft size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight">{pay.title}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <CalendarDays size={12} className="text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-400">
                        {new Date(pay.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-rose-600">₹{pay.dr.toLocaleString()}</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                    {pay.id}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <ReceiptText className="mx-auto text-slate-200 mb-2" size={48} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              No Payments in {months[filters.month - 1]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
